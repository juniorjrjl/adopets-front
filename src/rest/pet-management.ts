import axios from 'axios'
import { SessionKey } from '../constants/session-key';
import { PetSearchConfig } from './type/request/pet-search-config';
import WebResource from '../constants/web-resource';

export default class PetManagement{


    public static async findPageable(petSearchConfig: PetSearchConfig){
        let access_token = localStorage.getItem(SessionKey.ACCESS_TOKEN);
        if (!petSearchConfig.search.age_key){
            delete petSearchConfig.search.age_key
        }
        if (!petSearchConfig.search.sex_key){
            delete petSearchConfig.search.sex_key
        }
        if (!petSearchConfig.search.size_key){
            delete petSearchConfig.search.size_key
        }
        return axios.post(WebResource.PET_MANAGEMENT.PET_SEARCH, 
                          petSearchConfig,
                          {headers: {'Authorization': `Bearer ${access_token}`}})
    }
}