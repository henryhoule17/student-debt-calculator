import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  Container,
  Box,
  Grid2,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import EducationDetails from './components/EducationDetails';
import LoanDetails from './components/LoanDetails';
import ResultsCharts from './components/ResultsCharts';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  // State for school and major selection
  const [school, setSchool] = useState(null);
  const [major, setMajor] = useState(null);
  const [city, setCity] = useState(null);

  // State for loan details
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant="h3" gutterBottom align="center">
          Student Debt Calculator
        </Typography>
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Grid2 container spacing={3} sx={{ justifyContent: 'center' }}>
            {/* Education Details Section */}
            <Grid2 xs={12} md={6} sx={{ padding: 1 , width: '40%' }}>
              <EducationDetails
                school={school}
                setSchool={setSchool}
                major={major}
                setMajor={setMajor}
                city={city}
                setCity={setCity}
              />
            </Grid2>

            {/* Loan Details Section */}
            {<Grid2 xs={12} md={6} sx={{ padding: 1 , width: '40%' }}>
              <LoanDetails
                loanAmount={loanAmount}
                setLoanAmount={setLoanAmount}
                interestRate={interestRate}
                setInterestRate={setInterestRate}
                monthlyPayment={monthlyPayment}
                setMonthlyPayment={setMonthlyPayment}
              />
            </Grid2>}

            {/* Results Section */}
            <Grid2 xs={12} sx={{ padding: 1 , width: '80%', display: 'flex', justifyContent: 'center' }}>
              <ResultsCharts
                loanAmount={loanAmount ? Number(loanAmount) : 0}
                interestRate={interestRate ? Number(interestRate) : 0}
                monthlyPayment={monthlyPayment ? Number(monthlyPayment) : 0}
                major={major}
                city={city}
              />
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
//                 Education Details
//               </Typography>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={isInState}
//                     onChange={(e) => {
//                       setIsInState(e.target.checked);
//                       if (school) {
//                         fetchSchools(school.name);
//                       }
//                     }}
//                   />
//                 }
//                 label={isInState ? "In-State" : "Out-of-State"}
//               />
//               <Autocomplete
//                 options={schoolOptions}
//                 getOptionLabel={(option) => option.name}
//                 sx={{ width: '100%' }}
//                 renderInput={(params) => (
//                   <TextField 
//                     {...params} 
//                     label="School" 
//                     margin="normal" 
//                     fullWidth 
//                     InputProps={{
//                       ...params.InputProps,
//                       endAdornment: (
//                         <>
//                           {isLoadingSchools && (
//                             <CircularProgress color="inherit" size={20} />
//                           )}
//                           {params.InputProps.endAdornment}
//                         </>
//                       ),
//                     }}
//                   />
//                 )}
//                 onChange={(_, newValue) => setSchool(newValue)}
//                 loading={isLoadingSchools}
//                 onInputChange={(_, value) => fetchSchools(value)}
//                 noOptionsText="Type to search schools..."
//               />
//               {school && (
//                 <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
//                   4-Year Tuition: ${(school.tuition * 4).toLocaleString()}
//                 </Typography>
//               )}
//               <Autocomplete
//                 options={majors}
//                 getOptionLabel={(option) => option.name}
//                 sx={{ width: '100%' }}
//                 renderInput={(params) => (
//                   <TextField {...params} label="Major" margin="normal" fullWidth />
//                 )}
//                 onChange={(_, newValue) => setMajor(newValue)}
//               />
//               {major && (
//                 <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
//                   Starting Salary: ${major.salary.toLocaleString()}/year
//                 </Typography>
//               )}
//               <Autocomplete
//                 options={cities}
//                 getOptionLabel={(option) => option.name}
//                 sx={{ width: '100%' }}
//                 renderInput={(params) => (
//                   <TextField {...params} label="City" margin="normal" fullWidth />
//                 )}
//                 onChange={(_, newValue) => setCity(newValue)}
//               />
//               {city && (
//                 <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
//                   Cost of Living: ${city.costOfLiving.toLocaleString()} per month
//                 </Typography>
//               )}
//             </Paper>
//           </Grid2>

//           {/* Loan Details Section */}
//           <Grid2 item xs={12} md={4} sx={{ width: '40%', border: '2px dashed red', padding: 1}}>
//             <Paper sx={{ p: 2, height: '100%' }}>
//               <Typography variant="h6" gutterBottom>
//                 Loan Details
//               </Typography>
//               <TextField
//                 fullWidth
//                 label="Loan Amount"
//                 type="number"
//                 margin="normal"
//                 value={loanAmount}
//                 onChange={(e) => setLoanAmount(e.target.value)}
//               />
//               <TextField
//                 fullWidth
//                 label="Interest Rate (%)"
//                 type="number"
//                 margin="normal"
//                 value={interestRate}
//                 onChange={(e) => setInterestRate(e.target.value)}
//               />
//               <TextField
//                 fullWidth
//                 label="Monthly Payment"
//                 type="number"
//                 margin="normal"
//                 value={monthlyPayment}
//                 onChange={(e) => setMonthlyPayment(e.target.value)}
//               />
//             </Paper>
//           </Grid2>

//           {/* Summary Section */}
//           <Grid2 item xs={12} md={4} sx={{ width: '82%', border: '2px dashed red', padding: 1 }}>
//             <Paper sx={{ p: 2, width: '100%' }}>
//               <Typography variant="h6" gutterBottom>
//                 Loan Summary
//               </Typography>
//               {metrics && (
//                 <>
//                   <Typography variant="body1">
//                     Payoff Period: {`${Math.floor(metrics.yearsToPayoff)} years and ${Math.round((metrics.yearsToPayoff % 1) * 12)} months`}
//                   </Typography>
//                   <Typography variant="body1">
//                     Total Interest: ${metrics.totalInterest.toLocaleString()}
//                   </Typography>
//                   <Typography variant="body1">
//                     Total Amount Paid: ${metrics.totalPaid.toLocaleString()}
//                   </Typography>
//                 </>
//               )}
//             </Paper>
//           </Grid2>

//           {/* Debt Over Time Graph */}
//           <Grid2 item xs={12} md={6}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>
//                 Debt Over Time
//               </Typography>
//               {metrics?.debtData && (
//                 <LineChart width={500} height={300} data={metrics.debtData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="year" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Remaining Balance" />
//                   <Line type="monotone" dataKey="totalPaid" stroke="#82ca9d" name="Total AmountPaid" />
//                 </LineChart>
//               )}
//             </Paper>
//           </Grid2>

//           {/* Salary and Expenses Graph */}
//           <Grid2 item xs={12} md={6}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>
//                 Monthly Income vs. Expenses
//               </Typography>
//               {salaryMetrics && (
//                 <BarChart width={500} height={300} data={salaryMetrics}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="year" />
//                   <YAxis />
//                   <Tooltip 
//                     formatter={(value) => `$${value.toLocaleString()}`}
//                   />
//                   <Legend />
//                   <Bar name="Monthly Income" dataKey="monthlySalary" fill="#82ca9d" />
//                   <Bar name="Monthly Expenses" stackId="expenses" dataKey="monthlyPayment" fill="#8884d8" />
//                   <Bar name="Living Expenses" stackId="expenses" dataKey="livingExpenses" fill="#ff8042" />
//                 </BarChart>
//               )}
//             </Paper>
//           </Grid2>
//         </Grid2>
//       </Container>
//     </ThemeProvider>
//   );
// }

// export default App;
