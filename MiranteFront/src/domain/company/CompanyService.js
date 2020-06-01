export default class CompanyService {

    constructor(resource) {
        this._resource = resource('companies');
    }

    register(company) {
        return this._resource.save(company);       
    }

}