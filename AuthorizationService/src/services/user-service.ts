import { User } from "../models/employee";


export default interface UserService {

    registerUser(user: User): Promise<User>;

    retrieveAllUsers(): Promise<User[]>;

    retrieveUserByEmail(email: string): Promise<User>;

    verifyUser(user: User): Promise<Boolean>;

    isEmailAvailable(email: string): Promise<Boolean>;

};