import { Email } from "../models/email";


export default interface EmailService {

    composeEmail(email: Email): Promise<Email>;

}