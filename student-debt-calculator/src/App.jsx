import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Autocomplete,
  Box,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
    const monthlySalary = annualSalary / 12;
    const monthlyExpenses = city.costOfLiving;
    const monthlyPaymentFloat = parseFloat(monthlyPayment);

    const data = [];
    for (let year = 1; year <= 5; year++) {
      const salaryWithGrowth = annualSalary * Math.pow(1.03, year - 1); // 3% annual growth
      const monthlySalaryWithGrowth = salaryWithGrowth / 12;
      data.push({
        year,
        paymentRatio: (monthlyPaymentFloat / monthlySalaryWithGrowth * 100).toFixed(1),
        expenseRatio: (monthlyExpenses / monthlySalaryWithGrowth * 100).toFixed(1),
      });
    }

    return data;
  };

  const salaryMetrics = calculateSalaryMetrics();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Student Debt Calculator
        </Typography>
        
        <Grid container spacing={3}>
          {/* Input Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Education Details
              </Typography>
              <Autocomplete
                options={schools}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="School" margin="normal" />
                )}
                onChange={(_, newValue) => setSchool(newValue)}
              />
              <Autocomplete
                options={majors}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Major" margin="normal" />
                )}
                onChange={(_, newValue) => setMajor(newValue)}
              />
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="City" margin="normal" />
                )}
                onChange={(_, newValue) => setCity(newValue)}
              />
            </Paper>
          </Grid>

          {/* Loan Details Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
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
          </Grid>

          {/* Summary Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Loan Summary
              </Typography>
              {metrics && (
                <>
                  <Typography variant="body1">
                    Years to Pay Off: {metrics.yearsToPayoff}
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
          </Grid>

          {/* Debt Over Time Graph */}
          <Grid item xs={12} md={6}>
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
                  <Line type="monotone" dataKey="totalPaid" stroke="#82ca9d" name="Total Paid" />
                </LineChart>
              )}
            </Paper>
          </Grid>

          {/* Salary and Expenses Graph */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Expenses as % of Salary
              </Typography>
              {salaryMetrics && (
                <LineChart width={500} height={300} data={salaryMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="paymentRatio" stroke="#8884d8" name="Loan Payment %" />
                  <Line type="monotone" dataKey="expenseRatio" stroke="#82ca9d" name="Living Expenses %" />
                </LineChart>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
