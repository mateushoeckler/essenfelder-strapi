'use strict';

/**
 *  course controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course', ({ strapi }) =>  ({
  async getAllowedCourses(ctx) {
    try {
      let decoded = await strapi.plugin('users-permissions').service('jwt').verify(ctx.request.header.authorization.split(" ")[1]);
      const userId = decoded.id;

      var allowed_courses = (await strapi.db.query('api::user-course.user-course').findMany({
        where: { user: {id: userId } },
        populate: { course: true },
      })).map(obj => obj.course.id);

      var all_courses = (await strapi.db.query('api::course.course').findMany({
        populate: { Banner: true },
      }));
      all_courses.forEach((course) => {
        course.allowed = true;
      });

      ctx.body = { data: all_courses };
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  },
}));
