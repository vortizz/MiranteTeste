const jwt = require('jsonwebtoken');
const { errors } = require('../utils/responseStructure');

generateToken = async (datas) => {
    return jwt.sign(datas, process.env.JWT_KEY, { expiresIn: "12h" });
}

authorization = async (req, res, next) => {
    const authToken = req.body.authToken || req.params.authToken || req.headers['authorization'];
    
    if (authToken != undefined) {
        const [, aToken] = authToken.split(' ');
        const token = aToken ? aToken : authToken;
        jwt.verify(token, process.env.JWT_KEY, (err, data) => {
            if (err) {
                errors.error401(res, "Token inválido");
            } else {
                req.loggedCompany = {id: data.id, email: data.email};
                next();
            }
        });
    } else {
        errors.error401(res, "Token inválido");
    }
}

module.exports = { generateToken, authorization };