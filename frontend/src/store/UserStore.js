import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        this._user_token = "";
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    setToken(token) {
        this._user_token = token;
    }

    get token() {
        return this._user_token;
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }
}
