import { Expense } from "../entities";


export interface ExpenseDAO{

    // create a new expense
    createExpense(expense: Expense): Promise<Expense>;


    // get all expenses
    getAllExpenses(): Promise<Expense[]>;


    // get an expense by expense id
    getExpenseByExpenseId(expenseId: number): Promise<Expense>;


    // get all expenses of a patient id
    getAllExpensesByPatientId(patientId: number): Promise<Expense[]>;

    
    // get expenses by a range of billing date
    getExpensesByBillingDateRange(startDate: Date, endDate: Date): Promise<Expense[]>;


    // update an expense
    updateExpense(expense: Expense): Promise<Expense>;


    // delete an expense
    deleteExpense(expenseId: number): Promise<boolean>;
}