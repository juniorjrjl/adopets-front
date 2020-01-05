export default class WebResource{

    private static readonly BASE_URL : string = "https://test.adopets.app/v1/";

    private static readonly BASE_URL_AUTHENTICATION : string = "auth/";

    private static readonly BASE_URL_PET_MANAGEMENT : string = "pet/";

    public static readonly API_PKEY: string = "505763d6-4202-4b05-9efc-93b366939bcf";

    public static readonly AUTHENTICATION = {
        SESSION_REQUEST: `${WebResource.BASE_URL}${WebResource.BASE_URL_AUTHENTICATION}session-request`,
        CLIENT_AUTHORIZATION: `${WebResource.BASE_URL}${WebResource.BASE_URL_AUTHENTICATION}session-register`
    }

    public static readonly PET_MANAGEMENT ={
        SEARCH: `${WebResource.BASE_URL}${WebResource.BASE_URL_PET_MANAGEMENT}search`,
    }


}