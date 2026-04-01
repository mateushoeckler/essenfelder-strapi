'use strict';

/**
 *  course controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course', ({ strapi }) =>  ({
  async getAllowedCourses(ctx) {
    try {
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
