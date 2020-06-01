export default class CustomerService {

    constructor(resource) {
        this._res = resource('customers{/authToken}{/id}');
        this._resb = resource('customers{/id}');
    }

    register(customer) {
        return this._res.save(customer);     
    }

    updt(id, customer) {
        return this._resb.update({ id }, customer);
    }

    getAll(authToken) {
        return this._res.query({authToken});
    }

    getById(id, authToken) {
        return this._res.query({ id, authToken });
    }

    remove(id, authToken) {
        return this._res.delete({ id, authToken })
    }

}