const Neo4jHelper = require('../../database/Neo4jHelper');

class LoginDao {

    async authenticate(infos) {
        try {
            const { email } = infos;

            const query = `MATCH (c: Company)
                           WHERE c.email = $email
                           RETURN c
                           LIMIT 1`;
            
            return await Neo4jHelper.executeCommand(query, { email });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new LoginDao();