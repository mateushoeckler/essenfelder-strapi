'use strict';

/**
 * `isAllowed` policy.
 */

module.exports = async (policyContext, config, { strapi }) => {
    // Add your own logic here.
   //  strapi.log.info('In isAllowed policy.');
    // strapi.log.info(JSON.stringify(policyContext.state.user));

    const queried_level = policyContext.captures
    strapi.log.info(queried_level)

    // const user_max_level = (await strapi.db.query('api::user-course.user-course').findMany({
    //   where: { user: policyContext.state.user.id },
    //   populate: {max_lesson: true}
    // }))[0].max_lesson.id.toString()

    // strapi.log.info("LIVRO SOLICITADO: "+queried_level.toString())
    // strapi.log.info("LIVRO MAXIMO DO USUARIO: "+user_max_level.toString())

    // if (user_max_level >= queried_level) {
    //   return true;
    // }

    return true;
};
