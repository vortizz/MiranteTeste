const router = require('express').Router();
const customer = require('../../models/customer/Customer');
const CustomerController = require('../../controllers/customer/CustomerController');
const customerController = new CustomerController();
const { authorization } = require('../../service/authenticate');

const routes = CustomerController.routes();

router.get(routes.getAll, authorization, customerController.getAll);

router.get(routes.getOne, authorization, customerController.getOne);

router.delete(routes.delete, authorization, customerController.delete);

router.post(routes.create, authorization, customer.getValidations(), customerController.create);

router.put(routes.edit, authorization, customer.getValidations(), customerController.edit);

module.exports = router;