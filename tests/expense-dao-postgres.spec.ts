import { ExpenseDAO } from "../src/daos/expense-dao";
import { ExpenseDaoPostgres } from "../src/daos/expense-dao-postgres";
import { Expense } from "../src/entities";
import { connection_postgres } from "../src/connection-postgres";


const expenseDAO: ExpenseDAO = new ExpenseDaoPostgres();


// PASSED
test('Test: DAO createExpense', async () => {
    let sampleExpense: Expense = new Expense(0, 'reason 1', 111.11, '2021-11-19', 1);
    sampleExpense = await expenseDAO.createExpense(sampleExpense);

    expect(sampleExpense.expenseID).not.toBe(0);
});


// PASSED
test('Test: DAO getAllExpenses', async () => {
    let sampleExpense1: Expense = new Expense(0, 'reason 1', 111.11, '2021-11-19', 1);
    let sampleExpense2: Expense = new Expense(0, 'reason 2', 222.22, '2021-11-20', 2);
    let sampleExpense3: Expense = new Expense(0, 'reason 3', 333.33, '2021-11-21', 3);

    await expenseDAO.createExpense(sampleExpense1);
    await expenseDAO.createExpense(sampleExpense2);
    await expenseDAO.createExpense(sampleExpense3);

    const expenses: Expense[] = await expenseDAO.getAllExpenses();

    expect(expenses.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: DAO getExpenseByExpenseId', async () => {
    let sampleExpense: Expense = new Expense(0, 'reason 1', 111.11, '2021-11-19', 2);
    sampleExpense = await expenseDAO.createExpense(sampleExpense);
    let retrievedExpense: Expense = await expenseDAO.getExpenseByExpenseId(sampleExpense.expenseID);

    expect(retrievedExpense.expenseID).toBe(sampleExpense.expenseID);
    expect(retrievedExpense.reason).toBe(sampleExpense.reason);
});


// PASSED
test('Test: DAO getAllExpensesByPatientId', async () => {
    let sampleExpense1: Expense = new Expense(0, 'reason 1', 111.11, '2021-11-19', 1);
    let sampleExpense2: Expense = new Expense(0, 'reason 2', 222.22, '2021-11-19', 1);
    let sampleExpense3: Expense = new Expense(0, 'reason 3', 333.33, '2021-11-19', 1);

    sampleExpense1 = await expenseDAO.createExpense(sampleExpense1);
    sampleExpense1 = await expenseDAO.createExpense(sampleExpense2);
    sampleExpense1 = await expenseDAO.createExpense(sampleExpense3);

    const expenses: Expense[] = await expenseDAO.getAllExpensesByPatientId(sampleExpense1.p_ID);

    expect(expenses.length).toBeGreaterThanOrEqual(3);
});


test('Test: DAO searchExpensesByBillingDateRange', async () => {
    let sampleExpense1: Expense = new Expense(0, 'reason 1', 111.11, '2021-01-18', 1);
    let sampleExpense2: Expense = new Expense(0, 'reason 2', 222.22, '2021-02-20', 2);
    let sampleExpense3: Expense = new Expense(0, 'reason 3', 333.33, '2021-03-17', 3);

    await expenseDAO.createExpense(sampleExpense1);
    await expenseDAO.createExpense(sampleExpense2);
    await expenseDAO.createExpense(sampleExpense3);

    let startDateStr: string = '2021-01-01';
    let endDateStr: string = '2021-03-31';
    let startDate: Date = new Date(startDateStr);
    let endDate: Date = new Date(endDateStr);

    const expenses: Expense[] = await expenseDAO.getExpensesByBillingDateRange(startDate, endDate);

    expect(expenses.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: DAO updateExpense', async () => {
    let sampleExpense: Expense = new Expense(0, 'reason 1', 111.11, '2021-11-19', 1);
    sampleExpense = await expenseDAO.createExpense(sampleExpense);

    sampleExpense.reason = 'reason 2';
    sampleExpense.amount = 123.45;
    sampleExpense.p_ID = 2;

    sampleExpense = await expenseDAO.updateExpense(sampleExpense);

    const retrievedExpense: Expense = await expenseDAO.getExpenseByExpenseId(sampleExpense.expenseID);

    expect(retrievedExpense.reason).toBe('reason 2');
    expect(retrievedExpense.amount).toBe('$123.45');
    expect(retrievedExpense.p_ID).toBe(2);
});


// PASSED
test('Test: DAO deleteExpense', async () => {
    let sampleExpense: Expense = new Expense(0, 'reason 1', 111.11, '2021-11-19', 1);
    sampleExpense = await expenseDAO.createExpense(sampleExpense);;

    const delResult: boolean = await expenseDAO.deleteExpense(sampleExpense.expenseID);

    expect(delResult).toBe(true);
});


afterAll(async () => {
    connection_postgres.end();
});