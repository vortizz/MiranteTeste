const CustomerDao = require('../../infra/customer/CustomerDao');
const { errors , success } = require('../../utils/responseStructure');
const { validationResult } = require('express-validator');

class CustomerController {

    static routes() {
        return {
            create: '/customers',
            getAll: '/customers/:authToken',
            getOne: '/customers/:authToken/:id',
            delete: '/customers/:authToken/:id?',
            edit:   '/customers/:id?',
        }
    }

    async getAll(req, res) {
        try {
            const { id } = req.loggedCompany;
            const result = await CustomerDao.getAll(id);
            //success.correct200(res, result);
            res.send({ status: 200, data: result })
        } catch (error) {
            errors.error500(res, error);
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const result = await CustomerDao.getOne(id);
            success.correct200(res, result);
        } catch (error) {
            errors.error500(res, error);
        }
    }

    async create(req, res) {
        try {
            const err = validationResult(req);

            if (!err.isEmpty()) {
                errors.error422(res, err.array());
                return;
            }

            const { id } = req.loggedCompany;

            const result = await CustomerDao.create(id, req.body);
            success.created201(res, result);
        } catch (error) {
            errors.error500(res, error);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                errors.error401(res, "Não foi requerido o id para a remoção");
                return;
            }
            const result = await CustomerDao.delete(id);
            success.correct200(res, result);
        } catch (error) {
            errors.error500(res, error);
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                errors.error401(res, "Não foi requerido o id para a edição");
                return;
            }

            const err = validationResult(req);
            
            if (!err.isEmpty()) {
                errors.error422(res, err.array());
                return;
            }

            const result = await CustomerDao.edit(id, req.body);
            success.correct200(res, result);

        } catch (error) {
            errors.error500(res, error);
        }
    }

}

module.exports = CustomerController;