
export class Account {
    constructor(
        public accountID: number,
        public email: string,
        public password: string,
        public isActive: boolean
    ) { }
};