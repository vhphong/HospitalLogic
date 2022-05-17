import express from 'express';
import { Expense, Patient } from './entities';
import { MissingResourceError } from './error';
import cors from 'cors';
import PatientService from './services/patient-service';
import { PatientServiceImplPostgres } from './services/patient-service-impl-postgres';
import ExpenseService from './services/expense-service';
import { ExpenseServiceImplPostgres } from './services/expense-service-impl-postgres';

const app = express();
app.use(express.json());    // Middleware
app.use(cors());


const patientService: PatientService = new PatientServiceImplPostgres();
const expenseService: ExpenseService = new ExpenseServiceImplPostgres();


// endpoints for Patient Service----------------------------------------

// registerPatient service
app.post('/patients/create/', async (req, res) => {
    let newPatient: Patient = req.body;
    newPatient = await patientService.registerPatient(newPatient);
    res.status(200).send(newPatient);
});


// GET patient(s)
app.get('/patients', async (req, res) => {
    if (req.query.pid) {
        // if patient id was asked for, then execute searchPatientById service
        // GET /patients?pid=numericValue
        try {
            const pId: number = Number(req.query.pid);
            const patient: Patient = await patientService.searchPatientById(pId);
            res.status(200).send(patient);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    } else if (req.query.name) {
        // if patient name was asked for, then execute searchPatientsByName service
        // GET /patients?name=someone
        try {
            const pName: string = String(req.query.name);
            const patient: Patient[] = await patientService.searchPatientsByName(pName);
            res.status(200).send(patient);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    } else {
        // if no queries were asked for, then get all patients
        // GET /patients
        try {
            const allPatients: Patient[] = await patientService.retrieveAllPatients();
            res.status(200).send(allPatients);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    }
});


app.put('/patients', async (req, res) => {
    if (req.query.checkinId) {
        // if checkin request was sent, then execute checkinPatientById service
        // PUT /patients?checkinId=numericValuePatientId
        try {
            const pId: number = Number(req.query.checkinId);
            const patient: Patient = await patientService.checkinPatientById(pId);
            res.status(200).send(patient);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    } else if (req.query.checkoutId) {
        // if checkout request was sent, then execute checkoutPatientById service
        // PUT /patients?checkoutId=numericValuePatientId
        try {
            const pId: number = Number(req.query.checkoutId);
            const patient: Patient = await patientService.checkoutPatientById(pId);
            res.status(200).send(patient);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    } else {
        // if no requests were sent, then execute modifyPatient service to update patient
        // PUT /patients?updateId=numericValuePatientId
        try {
            const pId: number = Number(req.query.updateId);
            let retrievedPatient: Patient = await patientService.searchPatientById(pId);

            const currentIsInPatient: boolean = retrievedPatient.isInPatient;
            const currentPatientStatus: string = retrievedPatient.patientStatus;
            const currentDateOfVisit: string = retrievedPatient.dateOfVisit;

            // update with new values
            const newData = req.body;
            let newIsInPatient: boolean = newData.isInPatient;
            let newPatientStatus: string = newData.patientStatus;
            let newDateOfVisit: string = newData.dateOfVisit;

            if ((String(newData.isInPatient) === '') ||
                (newData.hasOwnProperty("isInPatient") === false)) {
                // keeps the old value
                newIsInPatient = currentIsInPatient;
            }

            if ((String(newData.patientStatus) === '') ||
                (newData.hasOwnProperty("patientStatus") === false)) {
                // keeps the old value
                newPatientStatus = currentPatientStatus;
            }

            if ((String(newData.dateOfVisit) === '') ||
                (newData.hasOwnProperty("dateOfVisit") === false)) {
                // keeps the old value
                newDateOfVisit = currentDateOfVisit;
            }

            retrievedPatient.isInPatient = newIsInPatient;
            retrievedPatient.patientStatus = newPatientStatus;
            retrievedPatient.dateOfVisit = newDateOfVisit;

            retrievedPatient = await patientService.modifyPatient(retrievedPatient);

            res.status(200).send(retrievedPatient);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    }
});


// removePatientById service
app.delete('/patients/delete/:pid', async (req, res) => {
    try {
        const pId: number = Number(req.params.pid);;
        const deleteResult: boolean = await patientService.removePatientById(pId);
        res.status(205).send(deleteResult);
    } catch (err) {
        if (err instanceof MissingResourceError) {
            res.status(400).send(err);
        }
    }
});


// endpoints for Expense Service----------------------------------------

// registerExpense service
app.post('/expenses/create/', async (req, res) => {
    try {
        let newExpense: Expense = req.body;

        // verify if patient ID exists?
        let retrievedPatient: Patient = await patientService.searchPatientById(newExpense.p_ID);

        console.log(retrievedPatient);

        if (retrievedPatient.patientID > 0) {
            // patient exists
            newExpense = await expenseService.registerExpense(newExpense);
            res.status(200).send(newExpense);
        } else {
            res.status(400).send(`The patient with ID ${newExpense.p_ID} does not exist.`);
        }
    } catch (error) {
        if (error instanceof MissingResourceError) {
            res.status(400).send(error);
        }
    }
});


// GET expense(s)
app.get('/expenses', async (req, res) => {
    if (req.query.eid) {
        // if expense id was asked for, then execute searchExpenseByExpenseId service
        // GET /expenses?eid=numericValue
        try {
            const eId: number = Number(req.query.eid);
            const expense: Expense = await expenseService.searchExpenseByExpenseId(eId);
            res.status(200).send(expense);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    } else if (req.query.pid) {
        // if patient name was asked for, then execute searchExpensesByPatientId service
        // GET /expenses?pid=numericValue
        try {
            const pId: number = Number(req.query.pid);
            const expenses: Expense[] = await expenseService.searchExpensesByPatientId(pId);
            res.status(200).send(expenses);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    } else if (req.query.fromDate || req.query.toDate) {
        // if billing date range was asked for, then execute searchExpensesByBillingDateRange service
        // GET /expenses?fromDate=somedate&toDate=somedate
        if (req.query.fromDate && !req.query.toDate) {  // from someday to today
            // GET http://localhost:3000/expenses?fromDate=2021-10-01
            try {
                let startDate: Date = new Date(String(req.query.fromDate));
                let endDate: Date = new Date();     // today

                const allExpenses: Expense[] = await expenseService.searchExpensesByBillingDateRange(startDate, endDate);

                res.status(200).send(allExpenses);
            } catch (err) {
                if (err instanceof MissingResourceError) {
                    res.status(400).send(err);
                }
            }
        } else if (req.query.fromDate && req.query.toDate) {   // from ... to ...
            // GET http://localhost:3000/expenses?fromDate=2021-01-01&toDate=2021-03-31
            try {
                let startDate: Date = new Date(String(req.query.fromDate));
                let endDate: Date = new Date(String(req.query.toDate));

                const allExpenses: Expense[] = await expenseService.searchExpensesByBillingDateRange(startDate, endDate);

                res.status(200).send(allExpenses);
            } catch (err) {
                if (err instanceof MissingResourceError) {
                    res.status(400).send(err);
                }
            }
        }
    } else {
        // if no queries were asked for, then get all expenses
        // GET /expenses
        try {
            const allExpenses: Expense[] = await expenseService.retrieveAllExpenses();
            res.status(200).send(allExpenses);
        } catch (err) {
            if (err instanceof MissingResourceError) {
                res.status(400).send(err);
            }
        }
    }
});


// modifyExpense service
app.put('/expenses/update/:eid', async (req, res) => {
    try {
        const eId: number = Number(req.params.eid);
        let retrievedExpense: Expense = await expenseService.searchExpenseByExpenseId(eId);

        const currentReason: string = retrievedExpense.reason;
        const currentAmount: number = retrievedExpense.amount;
        const currentBillDate: string = retrievedExpense.billDate;
        const currentPatientId: number = retrievedExpense.p_ID;

        // update with new value
        const newData = req.body;
        let newReason: string = newData.reason;
        let newAmount: number = newData.amount;;
        let newBillDate: string = newData.billDate;
        let newPatientId: number = newData.p_ID;

        if ((String(newData.reason) === '') ||
            (newData.hasOwnProperty("reason") === false)) {
            // keeps the old value
            newReason = currentReason;
        }

        if ((String(newData.amount) === '') ||
            (newData.hasOwnProperty("amount") === false)) {
            // keeps the old value
            newAmount = currentAmount;
        }

        if ((String(newData.billDate) === '') ||
            (newData.hasOwnProperty("billDate") === false)) {
            // keeps the old value
            newBillDate = currentBillDate;
        }

        if ((String(newData.p_ID) === '') ||
            (newData.hasOwnProperty("p_ID") === false)) {
            // keeps the old value
            newPatientId = currentPatientId;
        }

        retrievedExpense.reason = newReason;
        retrievedExpense.amount = newAmount;
        retrievedExpense.billDate = newBillDate;
        retrievedExpense.p_ID = newPatientId;

        retrievedExpense = await expenseService.modifyExpense(retrievedExpense);

        res.status(200).send(retrievedExpense);
    } catch (err) {
        if (err instanceof MissingResourceError) {
            res.status(400).send(err);
        }
    }
});


// removeExpense service
app.delete('/expenses/delete/:eid', async (req, res) => {
    try {
        const eId: number = Number(req.params.eid);
        const deleteResult: boolean = await expenseService.removeExpense(eId);
        res.status(205).send(deleteResult);
    } catch (err) {
        if (err instanceof MissingResourceError) {
            res.status(400).send(err);
        }
    }
});


const PORT = process.env.PORT_hsservice || 3004;
app.listen(PORT, () => {
    console.log("Hospital Service server started on port " + PORT)
});