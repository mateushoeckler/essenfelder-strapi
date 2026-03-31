'use strict';

/**
 * lesson router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// console.log(createCoreRouter('api::lesson.lesson')['routes'])

module.exports = createCoreRouter('api::lesson.lesson', {
  config: {
    findOne: {
      // disables authorization requirement for the `find` route
      policies: ['api::lesson.is-allowed'],
      // here you can also customize auth & middlewares
    },
  },
});
