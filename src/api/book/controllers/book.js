'use strict';

/**
 *  book controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) =>  ({
  async getAllowedBooks(ctx) {
    try {

      let decoded = await strapi.plugin('users-permissions').service('jwt').verify(ctx.request.header.authorization.split(" ")[1]);
      const userId = decoded.id;

      let requested_course = parseInt(ctx.request.url.split("/").pop())

      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        populate: { books: true },
      });

      if (!user) ctx.throw(403, 'User not found');

      let all_books = (await strapi.db.query('api::book.book').findMany({
        where: { course: {id: requested_course } },
        populate: { Cover: true, pdf: true },
      }));

      all_books.sort((a, b) => (a.id > b.id) ? 1 : (a.id < b.id) ? -1 : 0)

      const allowed_books_ids = user.books.map((book) => book.id)

      all_books.forEach((book) => {
        if (!allowed_books_ids.includes(book.id)) {
          book.allowed = false;
          book.Description = null;
          book.Checklist = null;
          book.Bibliography = null;
          book.Evaluation = null;
        } else book.allowed = true;
      });

      ctx.body = { data: all_books };
    } catch (err) {
      ctx.body = err;
    }
  },
}));
