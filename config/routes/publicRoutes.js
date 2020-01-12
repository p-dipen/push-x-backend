const publicRoutes = {
  "POST /signin": "UserController.login",
  "POST /user": "UserController.register",
  "POST /register": "UserController.register", // alias for POST /user
  "POST /login": "UserController.login",
  "POST /validate": "UserController.validate",
  "GET /running": "UserController.runing",
  "POST /activate": "UserController.checkactivate",
  "PUT /useractivate": "UserController.updatePassword",
  "POST /notify": "FirebaseController.sendNotification"
};

module.exports = publicRoutes;