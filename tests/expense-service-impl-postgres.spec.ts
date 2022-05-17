import { expect } from "@jest/globals";
import { connection_postgres } from "../src/connection-postgres";
import { Expense } from "../src/entities";
import ExpenseService from "../src/services/expense-service";
import { ExpenseServiceImplPostgres } from "../src/services/expense-service-impl-postgres";


const expenseService: ExpenseService = new ExpenseServiceImplPostgres();

// PASSED
test('Test: registerExpense service', async () => {
    let sampleExpense: Expense = new Expense(0, 'reason 1', 111.11, '11-19-2021', 1);
    sampleExpense = await expenseService.registerExpense(sampleExpense);

    expect(sampleExpense.p_ID).not.toBe(0);
});


// PASSED
test('Test: retrieveAllExpenses service', async () => {
    let sampleExpense1: Expense = new Expense(0, 'reason 1', 111.11, '11-19-2021', 1);
    let sampleExpense2: Expense = new Expense(0, 'reason 2', 222.22, '11-19-2021', 1);
    let sampleExpense3: Expense = new Expense(0, 'reason 3', 333.33, '11-19-2021', 1);

    await expenseService.registerExpense(sampleExpense1);
    await expenseService.registerExpense(sampleExpense2);
    await expenseService.registerExpense(sampleExpense3);

    const allExpenses: Expense[] = await expenseService.retrieveAllExpenses();

    expect(allExpenses.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: searchExpenseByExpenseId service', async () => {
    let sampleExpense: Expense = new Expense(0, 'reason 1', 111.11, '11-19-2021', 1);
    sampleExpense = await expenseService.registerExpense(sampleExpense);

    const retrievedExpense: Expense = await expenseService.searchExpenseByExpenseId(sampleExpense.expenseID);

    expect(retrievedExpense.expenseID).not.toBe(0);
    expect(retrievedExpense.reason).toBe(sampleExpense.reason);
    expect(retrievedExpense.p_ID).toEqual(sampleExpense.p_ID);
});


// PASSED
test('Test: searchExpensesByPatientId service', async () => {
    let sampleExpense1: Expense = new Expense(0, 'reason 1', 111.11, '11-19-2021', 1);
    let sampleExpense2: Expense = new Expense(0, 'reason 2', 222.22, '11-19-2021', 1);
    let sampleExpense3: Expense = new Expense(0, 'reason 3', 333.33, '11-19-2021', 1);

    await expenseService.registerExpense(sampleExpense1);
    await expenseService.registerExpense(sampleExpense2);
    await expenseService.registerExpense(sampleExpense3);

    const allExpenses: Expense[] = await expenseService.searchExpensesByPatientId(sampleExpense1.p_ID);

    expect(allExpenses.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: searchExpensesByBillingDateRange', async () => { 
    let sampleExpense1: Expense = new Expense(0, 'reason 1', 111.11, '2021-01-18', 1);
    let sampleExpense2: Expense = new Expense(0, 'reason 2', 222.22, '2021-02-20', 2);
    let sampleExpense3: Expense = new Expense(0, 'reason 3', 333.33, '2021-03-17', 3);

    await expenseService.registerExpense(sampleExpense1);
    await expenseService.registerExpense(sampleExpense2);
    await expenseService.registerExpense(sampleExpense3);

    let startDateStr: string = '2021-01-01';
    let endDateStr: string = '2021-03-31';
    let startDate: Date = new Date(startDateStr);
    let endDate: Date = new Date(endDateStr);

    const allExpenses: Expense[]=await expenseService.searchExpensesByBillingDateRange(startDate, endDate);

    expect(allExpenses.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: modifyExpense service', async () => {
    let sampleExpense: Expense = new Expense(0, 'reason 1', 111.11, '11-19-2021', 1);
    sampleExpense = await expenseService.registerExpense(sampleExpense);

    sampleExpense = await expenseService.searchExpenseByExpenseId(sampleExpense.expenseID);
    sampleExpense.reason = 'changed reason';
    sampleExpense.amount = 999.99;
    sampleExpense.p_ID = 2;

    sampleExpense = await expenseService.modifyExpense(sampleExpense);
    const retrievedExpense: Expense = await expenseService.searchExpenseByExpenseId(sampleExpense.expenseID);

    expect(retrievedExpense.reason).toBe('changed reason');
    expect(retrievedExpense.amount).toBe('$999.99');
    expect(retrievedExpense.p_ID).toEqual(2);
});


// PASSED
test('Test: removeExpense service', async () => {
    let sampleExpense: Expense = new Expense(0, 'reason 1', 111.11, '11-19-2021', 1);
    sampleExpense = await expenseService.registerExpense(sampleExpense);

    const delResult: boolean = await expenseService.removeExpense(sampleExpense.expenseID);

    expect(delResult).toBeTruthy;
});


afterAll(async () => {
    connection_postgres.end();
});