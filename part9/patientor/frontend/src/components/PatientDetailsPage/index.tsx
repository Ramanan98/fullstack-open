import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import patientService from "../../services/patients";
import { Patient, Entry } from "../../types";

const PatientDetailsPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);
      }
    };
    fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const getGenderIcon = () => {
    switch (patient.gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      default:
        return <TransgenderIcon />;
    }
  };

  const EntryDetails = ({ entry }: { entry: Entry }) => (
    <li style={{ marginBottom: "1rem" }}>
      <strong>{entry.date}</strong>: {entry.description}
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <div>
          <span style={{ fontWeight: "bold" }}>Diagnosis codes:</span>
          <ul style={{ margin: "0.25rem 0 0 1.5rem" }}>
            {entry.diagnosisCodes.map((code, index) => (
              <li key={index}>{code}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h4" component="h2">
            {patient.name}
          </Typography>
          {getGenderIcon()}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography>SSN: {patient.ssn}</Typography>
          <Typography>Occupation: {patient.occupation}</Typography>
          <Typography>Date of Birth: {patient.dateOfBirth}</Typography>
        </Box>
      </Box>

      <div style={{ marginTop: "2rem" }}>
        <h3>Entries</h3>
        {patient.entries.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {patient.entries.map((entry) => (
              <EntryDetails key={entry.id} entry={entry} />
            ))}
          </ul>
        ) : (
          <p>No entries found for this patient.</p>
        )}
      </div>
    </Box>
  );
};

export default PatientDetailsPage;
