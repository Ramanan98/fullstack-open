import { NewPatient } from "../types";
import { NewPatientSchema } from "../types";

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};
