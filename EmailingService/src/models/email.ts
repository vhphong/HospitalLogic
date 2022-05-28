
export class Email {
    constructor(
        public emailID: number,
        public senderEmail: string,
        public recipientEmail: string,
        public emailSubject: string,
        public content: string,
        public sendingDateTime: string
    ) { }
};