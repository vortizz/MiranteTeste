const router = require('express').Router();
const customerRoutes = require('./customer/customerRoutes');
const companyRoutes = require('./company/companyRoutes');
const loginRoutes = require('./login/loginRoutes');

router.use(loginRoutes);
router.use(customerRoutes);
router.use(companyRoutes);

router.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: "URL não existente"
    });
    next();
});

module.exports = router;