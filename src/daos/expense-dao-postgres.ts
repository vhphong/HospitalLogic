import { Expense } from "../entities";
import { ExpenseDAO } from "./expense-dao";
import { connection_postgres } from "../connection-postgres";
import { MissingResourceError } from "../error";


export class ExpenseDaoPostgres implements ExpenseDAO {

    async createExpense(expense: Expense): Promise<Expense> {
        const sqlString = 'INSERT INTO expense (reason, amount, billing_date, p_id) VALUES ($1, $2, $3, $4) RETURNING expense_id';
        const values = [expense.reason, expense.amount, expense.billDate, expense.p_ID];
        const result = await connection_postgres.query(sqlString, values);
        expense.expenseID = result.rows[0].expense_id;

        return expense;
    }


    async getAllExpenses(): Promise<Expense[]> {
        const sqlString = 'SELECT * FROM expense ORDER BY expense_id';
        const result = await connection_postgres.query(sqlString);
        const allExpenses: Expense[] = [];

        for (let row of result.rows) {
            const expense: Expense = new Expense(
                row.expense_id,
                row.reason,
                row.amount,
                row.billing_date,
                row.p_id
            );
            allExpenses.push(expense);
        }

        return allExpenses;
    }


    async getExpenseByExpenseId(expenseId: number): Promise<Expense> {
        const sqlString = 'SELECT * FROM expense WHERE expense_id = $1';
        const values = [expenseId];

        const result = await connection_postgres.query(sqlString, values);

        if (result.rowCount === 0) {
            throw new MissingResourceError(`The expense with ID ${expenseId} does not exist.`);
        }

        const row = result.rows[0];
        const retrievedExpense: Expense = new Expense(
            row.expense_id,
            row.reason,
            row.amount,
            row.billing_date,
            row.p_id
        );

        return retrievedExpense;
    }


    async getAllExpensesByPatientId(patientId: number): Promise<Expense[]> {
        const sqlString = 'SELECT * FROM expense WHERE p_id = $1';
        const values = [patientId];

        const result = await connection_postgres.query(sqlString, values);
        const allExpenses: Expense[] = [];

        if (result.rowCount === 0) {
            throw new MissingResourceError(`The expenses of the patient ID ${patientId} does not exist.`);
        }

        for (let row of result.rows) {
            const expense: Expense = new Expense(
                row.expense_id,
                row.reason,
                row.amount,
                row.billing_date,
                row.p_id
            );
            allExpenses.push(expense);
        }

        return allExpenses;
    }


    async getExpensesByBillingDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
        const sqlString: string = 'SELECT * FROM expense WHERE billing_date >= $1 AND billing_date <= $2';
        const values = [startDate, endDate];
        const result = await connection_postgres.query(sqlString, values);
        // date format: 'yyyy-mm-dd'
        const allExpenses: Expense[] = [];

        for (let row of result.rows) {
            const expense: Expense = new Expense(
                row.expense_id,
                row.reason,
                row.amount,
                row.billing_date,
                row.p_id
            );
            allExpenses.push(expense);
        }

        // let fromDateStr: string = '2021-01-01';
        // let toDateStr: string = '2021-03-31';
        // let fromDate: Date = new Date(fromDateStr);
        // let toDate: Date = new Date(toDateStr);

        // console.log('fromDate: ' + fromDate);
        // console.log('toDate: ' + toDate);

        return allExpenses;
    }


    async updateExpense(expense: Expense): Promise<Expense> {
        const sqlString: string = 'UPDATE expense SET reason = $1, amount = $2, billing_date = $3, p_id = $4 WHERE expense_id = $5';
        const values = [expense.reason, expense.amount, expense.billDate, expense.p_ID, expense.expenseID];
        const result = await connection_postgres.query(sqlString, values);

        if (result.rowCount === 0) {
            throw new MissingResourceError(`The expenses of the patient ID ${expense.p_ID} does not exist.`);
        }

        return expense;
    }


    async deleteExpense(expenseId: number): Promise<boolean> {
        const sqlString = 'DELETE FROM expense WHERE expense_id = $1';
        const values = [expenseId];
        const result = await connection_postgres.query(sqlString, values);

        if (result.rowCount === 0) {
            throw new MissingResourceError(`The expense with ID ${expenseId} does not exist.`);
        }

        return true;
    }
}