const CompanyDao = require('../../infra/company/CompanyDao');
const { errors , success } = require('../../utils/responseStructure');
const { validationResult } = require('express-validator');

class CompanyController {

    static routes() {
        return {
            create: "/companies",
            getOne: "/companies/:id"
        }
    }

    async create(req, res) {
        try {

            const err = validationResult(req);

            if (!err.isEmpty()) {
                errors.error422(res, err.array());
                return;
            }       

            const result = await CompanyDao.create(req.body);
            success.created201(res, result);

        } catch (error) {
            errors.error500(res, error);
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const result = await CompanyDao.getOne(id);
            success.correct200(res, result);
        } catch (error) {
            errors.error500(res, error);
        }
    }

}

module.exports = CompanyController;