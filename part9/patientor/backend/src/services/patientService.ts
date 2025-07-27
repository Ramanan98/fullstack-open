import patients from "../../data/patients";
import { NonSensitivePatientEntry, Patient } from "../types";

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

export default {
  getPatients,
  getNonSensitiveEntries,
};
