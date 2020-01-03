export default class WebResource{

    private static readonly BASE_URL : string = "https://test.adopets.app/v1/";

    private static readonly BASE_URL_AUTHENTICATION : string = "auth/";

    private static readonly BASE_URL_PET_MANAGEMENT : string = "pet/";

    public static readonly AUTHENTICATION = {
        SESSION_REQUEST: `${WebResource.BASE_URL}${WebResource.BASE_URL_AUTHENTICATION}session-request`,
        CLIENT_AUTHORIZATION: `${WebResource.BASE_URL}${WebResource.BASE_URL_AUTHENTICATION}session-register`
    }

    public static readonly PET_MANAGEMENT ={
        PET_SEARCH: `${WebResource.BASE_URL}${WebResource.BASE_URL_PET_MANAGEMENT}search`,
    }


}