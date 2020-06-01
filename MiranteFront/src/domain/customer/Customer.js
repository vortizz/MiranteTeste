export default class Customer {
     
    constructor(authToken = '', name = '', ssn = '', cell = '', email = '') {
        this.authToken = authToken;
        this.name = name;
        this.ssn = ssn;
        this.cell = cell;
        this.email = email;
    }

}