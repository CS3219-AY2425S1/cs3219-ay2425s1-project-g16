import { generatePasswordHash } from '@/lib/passwords';
import { admin as adminTable, db, users as usersTable } from '.';
import { eq } from 'drizzle-orm';

const TEST_USER_CREDENTIALS = {
  username: 'testuser01',
  email: 'test_user@email.com',
  firstName: 'test',
  lastName: 'user',
  password: '12345678', // For local testing purposes
};

const main = async () => {
  await db.transaction(async (tx) => {
    // Clear all users
    try {
      const seedRecords = await tx.select().from(adminTable).where(eq(adminTable.action, 'SEED'));
      if (seedRecords && seedRecords.length > 0) {
        console.info(
          `[Users]: Seeded already at: ${(seedRecords[seedRecords.length - 1].createdAt ?? new Date()).toLocaleString()}`
        );
        return;
      }
      await tx.delete(usersTable);

      const password = generatePasswordHash(TEST_USER_CREDENTIALS.password);
      // Insert
      await tx
        .insert(usersTable)
        .values({
          ...TEST_USER_CREDENTIALS,
          password,
        })
        .onConflictDoNothing();
      await tx.insert(adminTable).values({ action: 'SEED' });
    } catch (error) {
      console.error('[Users]: An error occurred while seeding: ' + String(error));
      process.exit(1);
    }
  });
};

void main()
  .catch((err) => {
    if (err !== null) {
      console.error('[Users]: Error occurred during seeding: ' + String(err));
      process.exit(1);
    }
  })
  .then(() => {
    console.log('[Users]: Seeding completed successfully');
    process.exit(0);
  });
