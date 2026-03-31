'use strict';

/**
 *  lesson controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lesson.lesson', ({ strapi }) =>  ({
  async getAllowedLessons(ctx) {
    try {

      let decoded = await strapi.plugin('users-permissions').service('jwt').verify(ctx.request.header.authorization.split(" ")[1]);
      const userId = decoded.id;

      const requested_book = parseInt(ctx.request.url.split("/").pop())

      const requested_course = (await strapi.db.query('api::book.book').findOne({
        where: { id: requested_book },
        populate: { course: true },
      })).course.id;

      const user_course = (await strapi.db.query('api::user-course.user-course').findOne({
        where: { user: {id: userId }, course: {id: requested_course} },
        populate: { course: true, allowed_books: true },
      }));

      const allowed_books_ids = user_course.allowed_books.map((book) => book.id)
      if (user_course == null) ctx.throw(403, 'Content not Allowed');
      if (!allowed_books_ids.includes(requested_book)) ctx.throw(403, 'Content not Allowed');

      const all_lessons = (await strapi.db.query('api::lesson.lesson').findMany({
        where: { book: {id: requested_book } },
        orderBy: { Order: 'asc' },
        populate: { Music_Sheet: true, MIDI: true, mp3: true },
      }));

      ctx.body = { data: all_lessons };
    } catch (err) {
      ctx.body = err;
    }
  },
}));
