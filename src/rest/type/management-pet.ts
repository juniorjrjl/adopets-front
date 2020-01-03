import axios from 'axios'
import { SessionKey } from '../../constants/session-key';
import { PetSearchConfig } from './request/pet-search-config';

export default class ManagementPet{

    private static readonly BASE_URL = "https://test.adopets.app/v1/pet/";

    public static async findPageable(petSearchConfig: PetSearchConfig){
        let access_token = sessionStorage.getItem(SessionKey.ACCESS_TOKEN);
        return axios.post(this.BASE_URL + "search", 
                          petSearchConfig,
                          {headers: {'Authorization': `Bearer ${access_token}`}})
    }
}