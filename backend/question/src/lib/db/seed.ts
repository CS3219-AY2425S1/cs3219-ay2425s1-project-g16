import { eq, sql } from 'drizzle-orm';

import { admin as adminTable, db, questions as questionTable } from '@/lib/db';
import { questionData } from './sample-data/questions';

const seedQuestions = async () => {
  try {
    await db.transaction(async (trx) => {
      const seedRecords = await trx.select().from(adminTable).where(eq(adminTable.action, 'SEED'));
      if (seedRecords && seedRecords.length > 0) {
        console.info(
          `[Questions]: Seeded already at: ${(seedRecords[seedRecords.length - 1].createdAt ?? new Date()).toLocaleString()}`
        );
        return;
      }
      // Delete all questions (not table)
      await trx.delete(questionTable);

      // Reset Serial to start index 1
      await trx.execute(sql`
      SELECT setval(
          pg_get_serial_sequence('questions', 'id'),
          COALESCE(max(id) + 1, 1), 
          false
      )
      FROM questions;  
      `);

      for (const question of questionData) {
        await trx
          .insert(questionTable)
          .values({ ...question, id: undefined }) // Let DB set ID
          .onConflictDoNothing();
      }
      await trx.insert(adminTable).values({ action: 'SEED' });
    });
  } catch (error) {
    console.log('[Questions]: Error seeding question data', error);
    process.exit(1);
  }
};

void seedQuestions()
  .then(() => {
    console.log('[Questions]: Seeding completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[Questions]: Error during seeding:', error);
    process.exit(1);
  });
