const { check } = require('express-validator');

class Login {

    getValidation() {
        return [
            this.getVEmail(),
            this.getVPassword()
        ];
    }

    getVEmail() {
        return check('email')
            .not().isEmpty()
            .withMessage('O Email deve ser requerido');
    }
    
    getVPassword() {
        return check('password')
            .not().isEmpty()
            .withMessage('A senha deve ser requerida');
    }

}

module.exports = new Login();