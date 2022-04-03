import { User } from "../models/employee";


export default interface UserService {

    registerUser(user: User): Promise<User>;

};