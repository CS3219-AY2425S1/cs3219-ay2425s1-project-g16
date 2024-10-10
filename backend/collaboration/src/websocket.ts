import 'dotenv/config';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import { setPersistence, setupWSConnection } from '@/y-postgresql-util/utils';
import { IWSSharedDoc } from '@/y-postgresql-util/interfaces';
import { PostgresqlPersistence } from 'y-postgresql';
import app from './server';

const server = createServer(app);

// y-websocket
const wss = new WebSocketServer({ server });
wss.on('connection', setupWSConnection);

PostgresqlPersistence.build({
  host: process.env.EXPRESS_DB_HOST,
  port: parseInt(process.env.EXPRESS_DB_PORT!, 10),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
})
  .then((pgdb) => {
    setPersistence({
      bindState: async (docName: string, ydoc: IWSSharedDoc) => {
        // Get the persisted document from PostgreSQL
        const persistedYdoc = await pgdb.getYDoc(docName);

        // Apply the current state from the database to the Yjs document
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));

        // Merge new updates with the persisted state and store
        ydoc.on('update', async (update: Uint8Array) => {
          const currentUpdates = await pgdb.getYDoc(docName);
          const mergedUpdates = Y.mergeUpdates([Y.encodeStateAsUpdate(currentUpdates), update]);
          //Remove the previous entry from the database
          await pgdb.clearDocument(docName);
          // Store the merged updates in the database
          await pgdb.storeUpdate(docName, mergedUpdates);
        });
      },

      // This function is called to write the final state (when the document is closed)
      writeState: (__docName: string, __ydoc: IWSSharedDoc) => {
        return new Promise((resolve) => {
          resolve(true);
        });
      },
    });
  })
  .catch((err) => console.log(err));

export default server;
