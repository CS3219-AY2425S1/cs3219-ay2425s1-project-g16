import { Pool } from 'pg';
import { PostgresqlPersistence } from 'y-postgresql';
import * as Y from 'yjs';

import { dbConfig } from '@/config';
import { logger } from '@/lib/utils';
import type { IWSSharedDoc } from '@/types/interfaces';

import { setPersistence } from './utils';

// From y-postgresql
const defaultTableName = 'yjs-writings';

async function migrateTable() {
  // Custom logic to add `updated_at` column if purging is desired
  const p = new Pool(dbConfig);
  const conn = await p.connect().then((client) => {
    logger.info('Migration Client connected');
    return client;
  });
  await conn
    .query(
      `
  DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
          FROM information_schema.columns 
          WHERE table_name = '${defaultTableName}'
          AND column_name = 'updated_at'
      ) THEN
        ALTER TABLE "${defaultTableName}"
          ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      END IF;
    END
  $$
  `
    )
    .then(() => {
      logger.info('Migration Complete');
    });
  p.end();
  logger.info('Migration Client disconnected');
}

export const setUpPersistence = async () => {
  const pgdb = await PostgresqlPersistence.build(dbConfig);
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

  await migrateTable();
};
