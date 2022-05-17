import { Patient } from "../entities";
import { PatientDAO } from "../daos/patient-dao";
import { connection_postgres } from "../connection-postgres";
import { MissingResourceError } from "../error";


export class PatientDaoPostgres implements PatientDAO {

    async createPatient(patient: Patient): Promise<Patient> {
        const sqlStr: string = 'INSERT INTO patient(patient_name, is_inpatient, patient_status, date_of_visit) VALUES ($1, $2, $3, $4) RETURNING patient_id';
        const values = [patient.patientName, patient.isInPatient, patient.patientStatus, patient.dateOfVisit];
        const result = await connection_postgres.query(sqlStr, values);
        patient.patientID = result.rows[0].patient_id;

        return patient;
    }


    async getAllPatients(): Promise<Patient[]> {
        const sqlStr: string = 'SELECT * FROM patient ORDER BY patient_id';
        const result = await connection_postgres.query(sqlStr);
        const allPatients: Patient[] = [];

        for (let row of result.rows) {
            const patient: Patient = new Patient(
                row.patient_id,
                row.patient_name,
                row.is_inpatient,
                row.patient_status,
                row.date_of_visit
            );
            allPatients.push(patient);
        }

        return allPatients;
    }


    async getPatientByPatientID(patientID: number): Promise<Patient> {
        const sqlStr: string = 'SELECT * FROM patient WHERE patient_id = $1';
        const values = [patientID];

        const result = await connection_postgres.query(sqlStr, values);

        if (result.rowCount === 0) {
            throw new MissingResourceError(`The patient with ID ${patientID} does not exist.`);
        }

        const row = result.rows[0];
        const retrievedPatient: Patient = new Patient(
            row.patient_id,
            row.patient_name,
            row.is_inpatient,
            row.patient_status,
            row.date_of_visit
        );

        return retrievedPatient;
    }


    async getPatientsByPatientName(patientName: string): Promise<Patient[]> {
        const sqlStr: string = 'SELECT patient_id, patient_name, is_inpatient, patient_status, date_of_visit FROM patient WHERE patient_name = $1';
        const values = [patientName];
        const result = await connection_postgres.query(sqlStr, values);
        const allPatients: Patient[] = [];

        for (let row of result.rows) {
            const patient: Patient = new Patient(
                row.patient_id,
                row.patient_name,
                row.is_inpatient,
                row.patient_status,
                row.date_of_visit
            );
            allPatients.push(patient);
        }

        return allPatients;
    }


    async updatePatient(patient: Patient): Promise<Patient> {
        const sqlStr: string = 'UPDATE patient SET patient_name = $1, is_inpatient = $2, patient_status = $3, date_of_visit = $4 WHERE patient_id = $5';
        const values = [patient.patientName, patient.isInPatient, patient.patientStatus, patient.dateOfVisit, patient.patientID];
        const result = await connection_postgres.query(sqlStr, values);

        if (result.rowCount === 0) {
            throw new MissingResourceError(`The patient with ID ${patient.patientID} does not exist.`);
        }

        return patient;
    }


    async deletePatient(patientID: number): Promise<boolean> {
        const sqlStr: string = 'DELETE FROM patient WHERE patient_id = $1';
        const values = [patientID];
        const result = await connection_postgres.query(sqlStr, values);

        if (result.rowCount === 0) {
            throw new MissingResourceError(`The patient with ID ${patientID} does not exist.`);
        }

        return true;
    }
}