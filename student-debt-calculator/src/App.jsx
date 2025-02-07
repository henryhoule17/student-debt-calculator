import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  Container,
  Paper,
  TextField,
  Typography,
  Autocomplete,
  Box,
  Grid2,
} from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  // State for form inputs
  const [school, setSchool] = useState(null);
  const [major, setMajor] = useState(null);
  const [city, setCity] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  // Mock data for demonstration - in a real app, this would come from an API
  const schools = [
    { name: 'Harvard University', tuition: 55000 },
    { name: 'MIT', tuition: 53000 },
    { name: 'Stanford University', tuition: 56000 },
  ];

  const majors = [
    { name: 'Computer Science', salary: 85000 },
    { name: 'Business Administration', salary: 65000 },
    { name: 'Engineering', salary: 80000 },
  ];

  const cities = [
    { name: 'San Francisco', costOfLiving: 3000 },
    { name: 'New York', costOfLiving: 2800 },
    { name: 'Austin', costOfLiving: 1800 },
  ];

  // Calculate loan metrics
  const calculateLoanMetrics = () => {
    if (!loanAmount || !interestRate || !monthlyPayment) return null;

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const payment = parseFloat(monthlyPayment);

    let balance = principal;
    let totalInterest = 0;
    let months = 0;
    const debtData = [];

    while (balance > 0 && months < 360) { // Cap at 30 years
      const interest = balance * rate;
      const principalPayment = Math.min(payment - interest, balance);
      balance -= principalPayment;
      totalInterest += interest;
      months++;

      if (months % 12 === 0) { // Add yearly data point
        debtData.push({
          year: months / 12,
          balance: Math.round(balance),
          totalPaid: Math.round((principal - balance) + totalInterest)
        });
      }
    }

    return {
      yearsToPayoff: (months / 12).toFixed(1),
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(principal + totalInterest),
      debtData
    };
  };

  const metrics = calculateLoanMetrics();

  // Calculate salary metrics
  const calculateSalaryMetrics = () => {
    if (!major || !city || !monthlyPayment) return null;

    const annualSalary = major.salary;

    const data = [{
      year: 1,
      monthlyPayment: parseFloat(monthlyPayment),
      livingExpenses: city.costOfLiving,
      monthlySalary: annualSalary / 12,
      remainingIncome: (annualSalary / 12) - parseFloat(monthlyPayment) - city.costOfLiving
    }];

    return data;
  };

  const salaryMetrics = calculateSalaryMetrics();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px solid green'}}>
        <Typography variant="h3" gutterBottom align="center">
          Student Debt Calculator
        </Typography>
        
        <Grid2 container spacing={3} sx={{ border: '2px solid blue' }} justifyContent="center">
          {/* Input Section */}
          <Grid2 item xs={12} md={4} sx={{ width: '40%', border: '2px dashed red', padding: 1 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Education Details
              </Typography>
              <Autocomplete
                options={schools}
                getOptionLabel={(option) => option.name}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField {...params} label="School" margin="normal" fullWidth />
                )}
                onChange={(_, newValue) => setSchool(newValue)}
              />
              {school && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  4-Year Tuition: ${(school.tuition * 4).toLocaleString()}
                </Typography>
              )}
              <Autocomplete
                options={majors}
                getOptionLabel={(option) => option.name}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField {...params} label="Major" margin="normal" fullWidth />
                )}
                onChange={(_, newValue) => setMajor(newValue)}
              />
              {major && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Starting Salary: ${major.salary.toLocaleString()}/year
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
          </Grid2>

          {/* Loan Details Section */}
          <Grid2 item xs={12} md={4} sx={{ width: '40%', border: '2px dashed red', padding: 1}}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Loan Details
              </Typography>
              <TextField
                fullWidth
                label="Loan Amount"
                type="number"
                margin="normal"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
              <TextField
                fullWidth
                label="Interest Rate (%)"
                type="number"
                margin="normal"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
              <TextField
                fullWidth
                label="Monthly Payment"
                type="number"
                margin="normal"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
              />
            </Paper>
          </Grid2>

          {/* Summary Section */}
          <Grid2 item xs={12} md={4} sx={{ width: '82%', border: '2px dashed red', padding: 1 }}>
            <Paper sx={{ p: 2, width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Loan Summary
              </Typography>
              {metrics && (
                <>
                  <Typography variant="body1">
                    Payoff Period: {`${Math.floor(metrics.yearsToPayoff)} years and ${Math.round((metrics.yearsToPayoff % 1) * 12)} months`}
                  </Typography>
                  <Typography variant="body1">
                    Total Interest: ${metrics.totalInterest.toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    Total Amount Paid: ${metrics.totalPaid.toLocaleString()}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid2>

          {/* Debt Over Time Graph */}
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Debt Over Time
              </Typography>
              {metrics?.debtData && (
                <LineChart width={500} height={300} data={metrics.debtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Remaining Balance" />
                  <Line type="monotone" dataKey="totalPaid" stroke="#82ca9d" name="Total AmountPaid" />
                </LineChart>
              )}
            </Paper>
          </Grid2>

          {/* Salary and Expenses Graph */}
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Income vs. Expenses
              </Typography>
              {salaryMetrics && (
                <BarChart width={500} height={300} data={salaryMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar name="Monthly Income" dataKey="monthlySalary" fill="#82ca9d" />
                  <Bar name="Monthly Expenses" stackId="expenses" dataKey="monthlyPayment" fill="#8884d8" />
                  <Bar name="Living Expenses" stackId="expenses" dataKey="livingExpenses" fill="#ff8042" />
                </BarChart>
              )}
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </ThemeProvider>
  );
}

export default App;
