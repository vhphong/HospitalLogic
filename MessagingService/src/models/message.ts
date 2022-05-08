
export class Message {
    constructor(
        public messageID: number,
        public senderEmail: string,
        public recipientEmail: string,
        public content: string
    ) { }
};