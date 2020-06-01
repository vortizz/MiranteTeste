
errors = {

    error400(res, error) {
        res.status(400).json({
            status: 400,
            message: error
        });
    },

    error401(res, error) {
        res.status(401).json({
            status: 401,
            message: error
        });
    },

    error404(res, error) {
        res.status(404).json({
            status: 404,
            message: error
        });
    },

    error422(res, error) {
        res.status(422).json({
            status: 422,
            message: error
        })
    },
    
    error500(res, error) {
        res.status(500).json({
            status: 500,
            message: error
        });
    } 

}

success = {

    correct200(res, data) {
        res.status(200).json({
            status: 200,
            message: 'OK',
            data: data
        });
    },

    created201(res, data) {
        res.status(201).json({
            status: 201,
            message: 'Created',
            data: data
        });
    }

}

module.exports = { errors , success };