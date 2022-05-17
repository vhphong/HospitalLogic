import { Patient } from "../entities";


export interface PatientDAO {
    
    // creates a new patient
    createPatient(patient: Patient): Promise<Patient>;


    // gets all patients
    getAllPatients(): Promise<Patient[]>;


    // gets a patient by patientID
    getPatientByPatientID(patientID: number): Promise<Patient>;


    // gets a patient by patientName
    getPatientsByPatientName(patientName: string): Promise<Patient[]>;


    // updates a patient
    updatePatient(patient: Patient): Promise<Patient>;


    // deletes a patient by patientID
    deletePatient(patientID: number): Promise<boolean>;
};