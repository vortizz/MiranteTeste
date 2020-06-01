const neo4j = require('neo4j-driver');

class Neo4jHelper {

    constructor() {
        this._userName = process.env.NEO4J_USERNAME;
        this._password = process.env.NEO4J_PASSWORD;
        this._url = process.env.NEO4J_URL;
        this._driver = undefined;
        this._session = undefined;
    }

    _getConnection() {
        try {
            const auth = neo4j.auth.basic(this._userName, this._password);
            this._driver = neo4j.driver(this._url, auth);
            this._session = this._driver.session(); 
        } catch (error) {
            throw error;
        }
    }

    async executeCommand(query, params = null) {
        try {

            this._getConnection();
            
            const records = await this._session.run(query, params);

            if (records && records.records) {
                return records.records.map(record => {
                    return record._fields[0].properties || record._fields[0];
                });
            }    
            return [];

        } catch (error) {
            throw error
        } finally {
            if (this._session) 
                this._session.close();
            if (this._driver)
                this._driver.close()
        }
    }

}

module.exports = new Neo4jHelper();
