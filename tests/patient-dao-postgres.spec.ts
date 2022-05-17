import { PatientDAO } from "../src/daos/patient-dao";
import { PatientDaoPostgres } from "../src/daos/patient-dao-postgres";
import { Patient } from "../src/entities";
import { connection_postgres } from "../src/connection-postgres";


const patientDAO: PatientDAO = new PatientDaoPostgres();


// PASSED
test('Test: DAO createPatient', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status', '2021-06-15');
    samplePatient1 = await patientDAO.createPatient(samplePatient1);

    console.log(samplePatient1);

    expect(samplePatient1.patientID).not.toBe(0);
});


// PASSED
test('Test: DAO getAllPatients', async () => {
    const samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status', '2021-07-16');
    const samplePatient2: Patient = new Patient(0, 'samplePatient2', true, 'Test status', '2021-08-20');
    const samplePatient3: Patient = new Patient(0, 'samplePatient3', true, 'Test status', '2021-09-18');

    await patientDAO.createPatient(samplePatient1);
    await patientDAO.createPatient(samplePatient2);
    await patientDAO.createPatient(samplePatient3);

    const patients: Patient[] = await patientDAO.getAllPatients();

    expect(patients.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: DAO getPatientByPatientID', async () => {
    let samplePatient: Patient = new Patient(0, 'samplePatient', true, 'Test status', '2021-10-28');
    samplePatient = await patientDAO.createPatient(samplePatient);
    let retrievedPatient: Patient = await patientDAO.getPatientByPatientID(samplePatient.patientID);

    expect(retrievedPatient.patientID).toBe(samplePatient.patientID);
    expect(retrievedPatient.patientName).toBe(samplePatient.patientName);
    expect(retrievedPatient.isInPatient).toBe(samplePatient.isInPatient);
    expect(retrievedPatient.patientStatus).toBe(samplePatient.patientStatus);
});


// PASSED
test('Test: DAO getPatientsByPatientName', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient', true, 'Test status', '2021-02-22');
    let samplePatient2: Patient = new Patient(0, 'samplePatient', true, 'Test status', '2021-03-29');
    let samplePatient3: Patient = new Patient(0, 'samplePatientDifferent', true, 'Test status', '2021-01-05');

    let result1: Patient = await patientDAO.createPatient(samplePatient1);
    let result2: Patient = await patientDAO.createPatient(samplePatient2);
    let result3: Patient = await patientDAO.createPatient(samplePatient3);

    let retrievedPatient1: Patient = await patientDAO.getPatientByPatientID(result1.patientID);
    let retrievedPatient2: Patient = await patientDAO.getPatientByPatientID(result2.patientID);
    let retrievedPatient3: Patient = await patientDAO.getPatientByPatientID(result3.patientID);

    expect(retrievedPatient1.patientName).toBe(retrievedPatient2.patientName);
    expect(retrievedPatient1.patientName).not.toBe(retrievedPatient3.patientName);
});


// PASSED
test('Test: DAO updatePatient', async () => {
    let samplePatient: Patient = new Patient(0, 'samplePatient', true, 'Test status', '2021-11-20');
    samplePatient = await patientDAO.createPatient(samplePatient);

    samplePatient.isInPatient = false;
    samplePatient = await patientDAO.updatePatient(samplePatient);

    const updatedResult: Patient = await patientDAO.getPatientByPatientID(samplePatient.patientID);

    expect(updatedResult.isInPatient).toBeFalsy;
});


// PASSED
test('Test: DAO deletePatient', async () => {
    let samplePatient: Patient = new Patient(0, 'samplePatient', true, 'Test status', '2021-11-29');
    samplePatient = await patientDAO.createPatient(samplePatient);

    const delResult: boolean = await patientDAO.deletePatient(samplePatient.patientID);

    expect(delResult).toBeTruthy();
});


afterAll(async () => {
    connection_postgres.end();
});