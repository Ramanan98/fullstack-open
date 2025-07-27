import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import {
  NewPatient,
  NonSensitivePatientEntry,
  Patient,
  Gender,
} from "../types";

const getPatients = (): Patient[] => {
  // Convert the gender strings from the data to the Gender enum
  return patients.map((patient) => ({
    ...patient,
    gender: patient.gender as Gender,
  }));
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender: gender as Gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getNonSensitiveEntries,
  addPatient,
};
