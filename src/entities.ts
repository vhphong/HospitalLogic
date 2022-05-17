
export class Patient {
    constructor(
        public patientID: number,
        public patientName: string,
        public isInPatient: boolean,
        public patientStatus: string,
        public dateOfVisit: string
    ) { }
};


export class Expense {
    constructor(
        public expenseID: number,
        public reason: string,
        public amount: number,
        public billDate: string,
        public p_ID: number,
    ) { }
};


// export class User {
//     constructor(
//         public userID: number,
//         public password: string,
//         public isActive: boolean
//     ) { }
// };


// export class Message {
//     constructor(
//         public mid: number,
//         public sender: string,
//         public recipient: string,
//         public content: string,
//         public isRead: boolean,
//         public date: string,
//         public time: string,
//     ) { }
// };