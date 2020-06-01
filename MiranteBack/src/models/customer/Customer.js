const CustomerDao = require('../../infra/customer/CustomerDao');
const { check } = require('express-validator');
const { dateDifferences, isSSN } = require('../../utils/several');

class Customer {

    getValidations() {
        return [
            this.getVName(),
            this.getVSSN(),
            this.getVEmail(),
            this.getVCell()
        ];
    }

    getVName() {
        return check('name')
            .isLength({ min: 3 })
            .withMessage('O nome deve ter pelo menos 3 caracteres')
            .isLength({ max: 100 })
            .withMessage('O nome deve ter no máximo 100 caracteres');
    }

    getVSSN() {
        return check('ssn')
            .not().isEmpty()
            .withMessage('O CPF deve ser requerido')
            .bail()
            .custom(value => {
                let v = value.replace(/[.]+/g, '').replace('-', '');
                return isSSN(v);
            })
            .withMessage('Deve ser um CPF válido')
            .bail()
            .custom(async (value, { req }) => {
                let { id } = req.loggedCompany;
                let result = await CustomerDao.getBySSN(value, id);
                let reqId = req.params.id;
                if (result.length > 0 && result[0].id != reqId) {
                    return Promise.reject();
                }
            })
            .withMessage('O CPF já está sendo utilizado')
    }

    getVEmail() {
        return check('email')
            .not().isEmpty()
            .withMessage('O Email deve ser requerido')
            .bail()
            .isEmail()
            .withMessage('Deve ser um email válido');
    }

    getVCell() {
        return check('cell')
            .not().isEmpty()
            .withMessage('O celular deve ser requerido');
    }
}

module.exports = new Customer();