import axios from 'axios';
import { SessionKey } from '../constants/session-key';
import { OrganizationUser } from './type/request/organization-user';
import WebResource from '../constants/web-resource';

export default class ClientAuthorization{

    public static async requestSession(){
        return axios.post(WebResource.AUTHENTICATION.SESSION_REQUEST, {system_api_key: WebResource.API_PKEY})
    }


    public static async authorizeUser(user: OrganizationUser){
        let access_key = localStorage.getItem(SessionKey.APP_KEY);
        localStorage.removeItem(SessionKey.APP_KEY);
        return axios.post(WebResource.AUTHENTICATION.CLIENT_AUTHORIZATION, 
                          {"organization_user": user}, 
                          {headers: {'Authorization': `Bearer ${access_key}`}})
    }

}