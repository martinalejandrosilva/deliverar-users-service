import { IEmployee, IEvent } from "../../../Models/types";
import User from "../../../Models/user.model";
const UserService = require("../../UserService")

export const adminPersonalHandler = (data : string) => {
    try{
        const event = JSON.parse(data);
        const eventContent : IEvent<unknown> = JSON.parse(event.content);
        
        switch(eventContent.event_name){
            case "new_user_create":
                adminPersonaHandleNewUserCreate(eventContent.data as IEmployee)
                break;
            default:
                console.log("default");
                break;
        }

    }catch(error){
        console.log(error);
    }
}

const adminPersonaHandleNewUserCreate = (employee : IEmployee) => {
    try{
        UserService.CreateUserFromEmployee(employee);
    }catch(error){
        console.log(error);
    }
}
