import * as Y from 'yjs';
import { PostgresqlPersistence } from 'y-postgresql';

import type { IWSSharedDoc } from '@/types/interfaces';
import { dbConfig } from '@/config';

import { setPersistence } from './utils';

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
};
