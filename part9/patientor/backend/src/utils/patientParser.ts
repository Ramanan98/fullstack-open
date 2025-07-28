import { NewPatient } from "../types";
import { NewPatientSchemaWithEntries } from "../types";

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchemaWithEntries.parse(object);
};
