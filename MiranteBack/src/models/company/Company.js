const CompanyDao = require('../../infra/company/CompanyDao');
const { check } = require('express-validator');
const { isNRLE } = require('../../utils/several');

class Company {

    getValidation() {
        return [
            this.getVName(),
            this.getVNRLE(),
            this.getVEmail(),
            this.getVPassword()
        ];
    }

    getVName() {
        return check('name')
            .isLength({ min: 3 })
            .withMessage('O nome deve ter pelo menos 3 caracteres')
            .isLength({ max: 100 })
            .withMessage('O nome deve ter no máximo 100 caracteres');
    }

    getVNRLE() {
        return check('nrle')
            .not().isEmpty()
            .withMessage('O CNPJ deve ser requerido')
            .bail()
            .custom(value => {
                let v = value.replace(/[.]+/g, '').replace('-', '').replace('/', '');
                return isNRLE(v);
            })
            .withMessage('Deve ser um CNPJ válido')
            .bail()
            .custom(async value => {
                let result = await CompanyDao.getByNrle(value);
                if (result.length > 0) {
                    return Promise.reject();
                }
            })
            .withMessage('O CNPJ já está sendo utilizado');
    }

    getVEmail() {
        return check('email')
            .not().isEmpty()
            .withMessage('O Email deve ser requerido')
            .bail()
            .isEmail()
            .withMessage('Deve ser um Email válido')
            .bail()
            .custom(async value => {
                let result = await CompanyDao.getByEmail(value);
                if (result.length > 0) {
                    return Promise.reject();
                }
            })
            .withMessage('O Email já está sendo utilizado');
    }

    getVPassword() {
        return check('password')
            .not().isEmpty()
            .withMessage('A senha deve ser requerida')
            .bail()
            .isLength({ min: 5 })
            .withMessage('A senha deve ter pelo menos 5 caracteres');
    }


}

module.exports = new Company();