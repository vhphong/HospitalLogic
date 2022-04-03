import { User } from "../models/employee";
import { UserDAOImpl } from "../daos/user-dao-impl";

import UserService from "./user-service";
import { UserDAO } from "../daos/user-dao";


export class UserServiceImpl implements UserService {

    userDAO: UserDAO = new UserDAOImpl();

    registerUser(user: User): Promise<User> {
        return this.userDAO.createUser(user);
    }

}