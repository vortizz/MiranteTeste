const router = require('express').Router();
const CompanyController = require('../../controllers/company/CompanyController');
const companyController = new CompanyController();
const company = require('../../models/company/Company');
const { authorization } = require('../../service/authenticate');

const routes = CompanyController.routes();

router.post(routes.create, company.getValidation(), companyController.create);

router.get(routes.getOne, authorization, companyController.getOne);

module.exports = router;