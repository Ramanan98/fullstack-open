import { v1 as uuid } from "uuid";
import patientsData from "../../data/patients";
import { NewPatient, NonSensitivePatientEntry, Patient } from "../types";

const patients: Patient[] = patientsData as Patient[];

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
    entries: [],
  };
  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

export default {
  getPatients,
  getNonSensitiveEntries,
  addPatient,
  findById,
};
