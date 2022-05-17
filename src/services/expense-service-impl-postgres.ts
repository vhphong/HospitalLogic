import { connection_postgres } from "../connection-postgres";
import { ExpenseDAO } from "../daos/expense-dao";
import { ExpenseDaoPostgres } from "../daos/expense-dao-postgres";
import { PatientDaoPostgres } from "../daos/patient-dao-postgres";
import { Expense, Patient } from "../entities";
import { PatientDAO } from "../daos/patient-dao";
import ExpenseService from "./expense-service";
import { MissingResourceError } from "../error";



export class ExpenseServiceImplPostgres implements ExpenseService {

    expenseDAO: ExpenseDAO = new ExpenseDaoPostgres();
    patientDAO: PatientDAO = new PatientDaoPostgres();

    async registerExpense(expense: Expense): Promise<Expense> {
        return this.expenseDAO.createExpense(expense);
    }


    retrieveAllExpenses(): Promise<Expense[]> {
        return this.expenseDAO.getAllExpenses();
    }


    searchExpenseByExpenseId(expenseId: number): Promise<Expense> {
        return this.expenseDAO.getExpenseByExpenseId(expenseId);
    }


    searchExpensesByPatientId(patientId: number): Promise<Expense[]> {
        return this.expenseDAO.getAllExpensesByPatientId(patientId);
    }


    searchExpensesByBillingDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
        return this.expenseDAO.getExpensesByBillingDateRange(startDate, endDate);
    }


    modifyExpense(expense: Expense): Promise<Expense> {
        return this.expenseDAO.updateExpense(expense);
    }


    removeExpense(expenseId: number): Promise<boolean> {
        return this.expenseDAO.deleteExpense(expenseId);
    }

}