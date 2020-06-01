const bcryptjs = require('bcryptjs');
const LoginDao = require('../../infra/login/LoginDao');
const { errors , success } = require('../../utils/responseStructure');
const { generateToken } = require('../../service/authenticate');
const { validationResult } = require('express-validator');

class LoginController {

    static routes() {
        return {
            authenticate: "/authenticate"
        };
    }

    async authenticate(req, res) {
        try {
            const err = validationResult(req);

            if (!err.isEmpty()) {
                errors.error422(res, err.array());
                return;
            }

            const result = await LoginDao.authenticate(req.body);

            if (result.length > 0) {
                const { email, password } = req.body;
                if (bcryptjs.compareSync(password, result[0].password)) {
                    const token = await generateToken({ id: result[0].id, email });
                    success.correct200(res, { token });
                    return;
                }
            }
            errors.error404(res, 'Email e senha estão incorretos');
        } catch (error) {
            errors.error500(res, error);
        }
    }

}

module.exports = LoginController;