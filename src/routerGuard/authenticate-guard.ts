import { SessionKey } from "../constants/session-key";

export default class AuthenticateGuard {

    public static isAuthenticate():boolean {
        return localStorage.getItem(SessionKey.ACCESS_TOKEN) !== null
    }

}