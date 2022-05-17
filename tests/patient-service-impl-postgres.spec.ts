import { Patient } from "../src/entities";
import PatientService from "../src/services/patient-service";
import { PatientServiceImplPostgres } from "../src/services/patient-service-impl-postgres";
import { connection_postgres } from "../src/connection-postgres";


const patientService: PatientService = new PatientServiceImplPostgres();

// PASSED
test('Test: registerPatient service', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status', '2021-11-11');
    samplePatient1 = await patientService.registerPatient(samplePatient1);

    expect(samplePatient1.patientID).not.toBe(0);
});


// PASSED
test('Test: retrieveAllPatients service', async () => {
    const samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status', '2021-11-13');
    const samplePatient2: Patient = new Patient(0, 'samplePatient2', true, 'Test status', '2021-11-13');
    const samplePatient3: Patient = new Patient(0, 'samplePatient3', true, 'Test status', '2021-11-13');

    await patientService.registerPatient(samplePatient1);
    await patientService.registerPatient(samplePatient2);
    await patientService.registerPatient(samplePatient3);

    const allPatients: Patient[] = await patientService.retrieveAllPatients();

    expect(allPatients.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: searchPatientById service', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status', '2021-11-13');
    samplePatient1 = await patientService.registerPatient(samplePatient1);

    const retrievedPatient: Patient = await patientService.searchPatientById(samplePatient1.patientID);

    expect(retrievedPatient.patientID).not.toBe(0);
    expect(retrievedPatient.patientName).toBe(samplePatient1.patientName);
    expect(retrievedPatient.isInPatient).toBe(samplePatient1.isInPatient);
    expect(retrievedPatient.patientStatus).toBe(samplePatient1.patientStatus);
});


// PASSED
test('Test: searchPatientsByName service', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status', '2021-11-13');
    samplePatient1 = await patientService.registerPatient(samplePatient1);

    const retrievedPatient: Patient[] = await patientService.searchPatientsByName(samplePatient1.patientName);

    expect(retrievedPatient.length).toBeGreaterThanOrEqual(1);
    expect(retrievedPatient[0].patientName).toBe(samplePatient1.patientName);
});


// PASSED
test('Test: checkinPatientById service', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient1', false, 'Test status', '2021-11-13');
    samplePatient1 = await patientService.registerPatient(samplePatient1);

    await patientService.checkinPatientById(samplePatient1.patientID);
    const retrievedPatient: Patient = await patientService.searchPatientById(samplePatient1.patientID);

    expect(retrievedPatient.isInPatient).not.toBeFalsy;
});


// PASSED
test('Test: checkoutPatientById service', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status', '2021-11-13');
    samplePatient1 = await patientService.registerPatient(samplePatient1);

    await patientService.checkoutPatientById(samplePatient1.patientID);
    const retrievedPatient: Patient = await patientService.searchPatientById(samplePatient1.patientID);

    expect(retrievedPatient.isInPatient).not.toBeTruthy;
});


// PASSED
test('Test: modifyPatient service', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status 1', '2021-11-13');
    samplePatient1 = await patientService.registerPatient(samplePatient1);

    samplePatient1.isInPatient = false;
    samplePatient1.patientStatus = 'Test status 2';

    samplePatient1 = await patientService.modifyPatient(samplePatient1);

    const updatedResult: Patient = await patientService.searchPatientById(samplePatient1.patientID);

    expect(updatedResult.isInPatient).not.toBeTruthy;
    expect(updatedResult.patientStatus).toBe('Test status 2');
});


// PASSED
test('Test: removePatientById service', async () => {
    let samplePatient1: Patient = new Patient(0, 'samplePatient1', true, 'Test status', '2021-11-13');
    samplePatient1 = await patientService.registerPatient(samplePatient1);

    const result: boolean = await patientService.removePatientById(samplePatient1.patientID);

    expect(result).toBeTruthy;
});


afterAll(async () => {
    connection_postgres.end();
});