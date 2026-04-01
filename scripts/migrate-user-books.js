'use strict';

/**
 * Migration script to transfer book permissions from the 'user-course'
 * collection to the direct 'books' relationship in the User content type.
 */

async function migrate() {
  const strapi = require('@strapi/strapi')();
  await strapi.load();

  console.log('Starting migration...');

  try {
    const userCourses = await strapi.db.query('api::user-course.user-course').findMany({
      populate: { user: true, allowed_books: true },
    });

    console.log(`Found ${userCourses.length} user-course records to process.`);

    for (const record of userCourses) {
      if (!record.user || !record.allowed_books || record.allowed_books.length === 0) {
        continue;
      }

      const userId = record.user.id;
      const bookIds = record.allowed_books.map(book => book.id);

      console.log(`Migrating ${bookIds.length} books for user ${record.user.username} (ID: ${userId})...`);

      // Get current books to avoid overwriting existing ones (if any)
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        populate: { books: true },
      });

      const currentBookIds = (user.books || []).map(b => b.id);
      const combinedBookIds = Array.from(new Set([...currentBookIds, ...bookIds]));

      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: {
          books: combinedBookIds,
        },
      });
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
