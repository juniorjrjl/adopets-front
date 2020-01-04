import { Route, RouteProps, Redirect } from "react-router-dom";
import React from "react";
import Notification from '../notify/notification';


export interface PrivateRouteProps extends RouteProps { 
    isAuthenticated: () => boolean;
    isAllowed: boolean;
    authenticationPath: string;
}


export const PrivateRoute: React.FC<PrivateRouteProps> = props =>{

    if (props.isAuthenticated()){
        return <Route {... props} />
    }else{
        Notification.sendNotification("error", "Error", "You must authenticate yourself for access this resource.");
        const AuthenticateComponent = () => <Redirect to={{pathname: props.authenticationPath}}/>
        return <Route {... props} component={AuthenticateComponent} render={undefined}/>        
    }

}

export default PrivateRoute;