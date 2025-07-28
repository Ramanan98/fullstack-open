import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import patientService from "../../services/patients";
import { Patient } from "../../types";

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

  return (
    <div>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h4" component="h2">
            {patient.name}
          </Typography>
          {getGenderIcon()}
        </Box>

        <Typography>ssn: {patient.ssn}</Typography>
        <Typography>occupation: {patient.occupation}</Typography>
        <Typography>date of birth: {patient.dateOfBirth}</Typography>
      </Box>
    </div>
  );
};

export default PatientDetailsPage;
