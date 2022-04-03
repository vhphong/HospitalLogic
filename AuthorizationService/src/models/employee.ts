
export class User {
    constructor(
        public userID: number,
        public email: string,
        public password: string,
        public isActive: boolean
    ) { }
};