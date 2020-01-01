import axios from 'axios';
import { SessionKey } from '../constants/session-key';
import { OrganizationUser } from './type/request/organization-user';

export default class AuthorizationClient{


    private static readonly BASE_URL = "https://test.adopets.app/v1/auth/";

    public static async requestSession(){
        return axios.post(this.BASE_URL + "session-request", {system_api_key: "505763d6-4202-4b05-9efc-93b366939bcf"})
    }


    public static async authorizeUser(user: OrganizationUser){
        let access_key = sessionStorage.getItem(SessionKey.APP_KEY);
        sessionStorage.removeItem(SessionKey.APP_KEY);
        return axios.post(this.BASE_URL + "session-register", 
                          {"organization_user": user}, 
                          {headers: {'Authorization': `Bearer ${access_key}`}})
    }

}