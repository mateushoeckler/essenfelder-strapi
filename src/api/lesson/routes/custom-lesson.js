module.exports = {
  routes: [
    { // Path defined with an URL parameter
      method: 'GET',
      path: '/allowedLessons/:idBook',
      handler: 'api::lesson.lesson.getAllowedLessons',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // { // Path defined with a regular expression
    //   method: 'GET',
    //   path: '/restaurants/:category([a-z]+)', // Only match when the URL parameter is composed of lowercase letters
    //   handler: 'restaurant.findByCategory',
    // }
  ]
}
