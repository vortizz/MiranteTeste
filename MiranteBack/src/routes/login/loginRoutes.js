const router = require('express').Router();
const Login = require('../../models/login/Login');
const LoginController = require('../../controllers/login/LoginController');
const loginController = new LoginController();

const routes = LoginController.routes();

router.post(routes.authenticate, Login.getValidation(), loginController.authenticate);

module.exports = router;