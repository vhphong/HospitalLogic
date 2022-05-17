import { Patient } from "../entities";
import { PatientDAO } from "../daos/patient-dao";
import { PatientDaoPostgres } from "../daos/patient-dao-postgres";
import PatientService from "./patient-service";


export class PatientServiceImplPostgres implements PatientService {

    patientDAO: PatientDAO = new PatientDaoPostgres();

    registerPatient(patient: Patient): Promise<Patient> {
        return this.patientDAO.createPatient(patient);
    }


    retrieveAllPatients(): Promise<Patient[]> {
        return this.patientDAO.getAllPatients();
    }


    searchPatientById(patientId: number): Promise<Patient> {
        return this.patientDAO.getPatientByPatientID(patientId);
    }


    searchPatientsByName(patientName: string): Promise<Patient[]> {
        return this.patientDAO.getPatientsByPatientName(patientName);
    }


    async checkinPatientById(patientId: number): Promise<Patient> {
        const retrievedPatient: Patient = await this.patientDAO.getPatientByPatientID(patientId);
        retrievedPatient.isInPatient = true;

        return this.patientDAO.updatePatient(retrievedPatient);
    }


    async checkoutPatientById(patientId: number): Promise<Patient> {
        const retrievedPatient: Patient = await this.patientDAO.getPatientByPatientID(patientId);
        retrievedPatient.isInPatient = false;

        return this.patientDAO.updatePatient(retrievedPatient);
    }


    modifyPatient(patient: Patient): Promise<Patient> {
        return this.patientDAO.updatePatient(patient);
    }


    removePatientById(patientId: number): Promise<boolean> {
        return this.patientDAO.deletePatient(patientId);
    }

};