export default class LoginService {

    constructor(resource) {
        this._resource = resource('authenticate');
    }

    access(infos) {
        return this._resource.save(infos);
    }

}