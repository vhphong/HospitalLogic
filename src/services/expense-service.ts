import { Expense } from "../entities";


export default interface ExpenseService {

    registerExpense(expense: Expense): Promise<Expense>;

    retrieveAllExpenses(): Promise<Expense[]>;

    searchExpenseByExpenseId(expenseId: number): Promise<Expense>;

    searchExpensesByPatientId(patientId: number): Promise<Expense[]>;

    searchExpensesByBillingDateRange(startDate: Date, endDate: Date): Promise<Expense[]>;

    modifyExpense(expense: Expense): Promise<Expense>;

    removeExpense(expenseId: number): Promise<boolean>;

}