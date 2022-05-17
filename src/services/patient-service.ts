import { Patient } from "../entities";


export default interface PatientService {

    registerPatient(patient: Patient): Promise<Patient>;

    retrieveAllPatients(): Promise<Patient[]>;

    searchPatientById(patientId: number): Promise<Patient>;

    searchPatientsByName(patientName: string): Promise<Patient[]>;

    checkinPatientById(patientId: number): Promise<Patient>;

    checkoutPatientById(patientId: number): Promise<Patient>;

    modifyPatient(patient: Patient): Promise<Patient>;

    removePatientById(patientId: number): Promise<boolean>;

};