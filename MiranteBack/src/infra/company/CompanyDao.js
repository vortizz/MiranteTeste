const Neo4jHelper = require('../../database/Neo4jHelper');
const { v4 } = require("uuid");
const bcryptjs = require('bcryptjs');

class CompanyDao {

    async create(company) {
        try {
            const query = ` CREATE(c: Company {
                            id: $id,
                            name: $name,
                            nrle: $nrle,
                            email: $email,
                            password: $password })
                            RETURN c`;

            const salt = bcryptjs.genSaltSync(10);
            const hash = bcryptjs.hashSync(company.password, salt);

            const id = v4();
            const params = { 
                id: id, 
                name: company.name, 
                nrle: company.nrle, 
                email: company.email, 
                password: hash 
            };
            
            return await Neo4jHelper.executeCommand(query, params);

        } catch (error) {
            throw error;
        }
    }

    async getByNrle(nrle) {
        try {
            const query = ` MATCH (c: Company)
                            WHERE c.nrle = $nrle
                            RETURN c`;

            return await Neo4jHelper.executeCommand(query, { nrle });                            
        } catch (error) {
            throw error;
        }
    }

    async getOne(id) {
        try {
            const query = `MATCH (c: Company)
                           WHERE c.id = $id
                           RETURN c`;
            return await Neo4jHelper.executeCommand(query, { id });                           
        } catch (error) {
            throw error;
        }
    }

    async getByEmail(email) {
        try {
            const query = ` MATCH (c: Company)
                            WHERE c.email = $email
                            RETURN c`;
            return await Neo4jHelper.executeCommand(query, { email });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new CompanyDao();
