import { notification } from "antd";

export default class Notification{

    public static sendNotification(type: 'success' | 'info' | 'error' | 'warning', title: string, detail: string){
        notification[type]({message: title, description: detail});
    }

}