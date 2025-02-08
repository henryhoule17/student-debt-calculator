import { useState } from 'react';
import {
  Paper,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';

const EducationDetails = ({ school, setSchool, major, setMajor, city, setCity }) => {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [majorOptions, setMajorOptions] = useState([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingMajors, setIsLoadingMajors] = useState(false);
  const [isInState, setIsInState] = useState(true);

  const cities = [
    { name: 'San Francisco', costOfLiving: 5000 },
    { name: 'New York', costOfLiving: 6000 },
    { name: 'Austin', costOfLiving: 3500 },
  ];

  const fetchSchools = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSchoolOptions([]);
      return;
    }

    setIsLoadingSchools(true);
    try {
      const response = await fetch(`http://localhost:8000/api/schools/search/?query=${encodeURIComponent(searchQuery)}&is_in_state=${isInState}`);
      if (!response.ok) throw new Error('Failed to fetch schools');
      const data = await response.json();
      setSchoolOptions(data);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setSchoolOptions([]);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Education Details
      </Typography>
      {/* School Search Bar */}
      <FormControlLabel
        control={
          <Switch
            checked={isInState}
            onChange={async (e) => {
              setIsInState(e.target.checked);
              if (school) {
                // Fetch updated school data with new in-state status
                const response = await fetch(`http://localhost:8000/api/schools/search/?query=${encodeURIComponent(school.name)}&is_in_state=${e.target.checked}`);
                if (response.ok) {
                  const data = await response.json();
                  // Find and update the current school with new tuition
                  const updatedSchool = data.find(s => s.name === school.name);
                  if (updatedSchool) {
                    setSchool(updatedSchool);
                  }
                }
              }
            }}
          />
        }
        label={isInState ? "In-State" : "Out-of-State"}
      />
      <Autocomplete
        options={schoolOptions}
        getOptionLabel={(option) => option.name}
        sx={{ width: '100%' }}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="School" 
            margin="normal" 
            fullWidth 
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingSchools && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        onChange={async (_, newValue) => {
          setSchool(newValue);
          setMajor(null);
          if (newValue) {
            setIsLoadingMajors(true);
            try {
              const response = await fetch(`http://localhost:8000/api/schools/${newValue.id}/majors/`);
              if (response.ok) {
                const data = await response.json();
                setMajorOptions(data);
              }
            } catch (error) {
              console.error('Error fetching majors:', error);
              setMajorOptions([]);
            } finally {
              setIsLoadingMajors(false);
            }
          } else {
            setMajorOptions([]);
          }
        }}
        loading={isLoadingSchools}
        onInputChange={(_, value) => fetchSchools(value)}
      />
      {school && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          4-Year Tuition: ${(school.tuition * 4).toLocaleString()}
        </Typography>
      )}
      {/* Major Search Bar */}
      <Autocomplete
        options={majorOptions}
        getOptionLabel={(option) => option.name}
        sx={{ width: '100%' }}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Major" 
            margin="normal" 
            fullWidth 
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingMajors && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        onChange={(_, newValue) => setMajor(newValue)}
        disabled={!school}
      />
      {major && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Expected Starting Salary: ${major.salary.toLocaleString()}
        </Typography>
      )}
      <Autocomplete
        options={cities}
        getOptionLabel={(option) => option.name}
        sx={{ width: '100%' }}
        renderInput={(params) => (
          <TextField {...params} label="City" margin="normal" fullWidth />
        )}
        onChange={(_, newValue) => setCity(newValue)}
      />
      {city && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Cost of Living: ${city.costOfLiving.toLocaleString()} per month
        </Typography>
      )}
    </Paper>
  );
};

export default EducationDetails;
