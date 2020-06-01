const Neo4jHelper = require('../../database/Neo4jHelper');
const { v4 } = require("uuid");

class CustomerDao {

    async getAll(compId) {
        try {
            const query = ` MATCH (c: Customer)-[:buyFrom]->(cy: Company)
                            WHERE cy.id = $compId
                            RETURN c`
            return await Neo4jHelper.executeCommand(query, { compId });
        } catch (error) {
            throw error;
        }
    }

    async getOne(id) {
        try {
            const query = `MATCH (c: Customer)
                           WHERE c.id = $id
                           RETURN c`;
            return await Neo4jHelper.executeCommand(query, { id });
        } catch (error) {
            throw error;
        }
    }

    async getBySSN(ssn, compId) {
        try {
            /*
            const query = ` MATCH (c: Customer)
                            WHERE c.ssn = $ssn
                            RETURN c`;
                            */
            const query = ` MATCH (c: Customer)-[:buyFrom]->(cy: Company)
                            WHERE cy.id = $compId AND c.ssn = $ssn
                            RETURN c`

            return await Neo4jHelper.executeCommand(query, { compId, ssn });                            
        } catch (error) {
            throw error;
        }
    }

    async create(compId, customer) {
        try {          
            const query = ` MATCH(c: Company) WHERE c.id = $compId
                            CREATE (cm: Customer {
                                id: $id,
                                name: $name, 
                                email: $email, 
                                ssn: $ssn, 
                                cell: $cell
                            })
                            MERGE (cm)-[:buyFrom]->(c)
                            RETURN cm`;

            const id = v4();     
            const params = { compId, id, ...customer };
         
            return await Neo4jHelper.executeCommand(query, params);   
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const query = `MATCH (c: Customer { id: $id }) DETACH DELETE c`;
            const records = await Neo4jHelper.executeCommand(query, { id });
            return { id, records };
        } catch (error) {
            throw error;
        }
    }

    async edit(id, newValues) {
        try {
            const query = ` MATCH (c: Customer { id: $id })
                            SET c = {
                                id: $id,
                                name: $name, 
                                email: $email,
                                ssn: $ssn, 
                                cell: $cell
                            }
                            RETURN c `;
                            
            const params = { id, ...newValues };
            return await Neo4jHelper.executeCommand(query, params);
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new CustomerDao();