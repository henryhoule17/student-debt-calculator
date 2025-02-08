import {
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const LoanDetails = ({ loanAmount, setLoanAmount, interestRate, setInterestRate, monthlyPayment, setMonthlyPayment }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Loan Details
      </Typography>
      <TextField
        label="Loan Amount"
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: '$',
        }}
      />
      <TextField
        label="Interest Rate"
        type="number"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: '%',
        }}
      />
      <TextField
        label="Monthly Payment"
        type="number"
        value={monthlyPayment}
        onChange={(e) => setMonthlyPayment(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: '$',
        }}
      />
    </Paper>
  );
};

export default LoanDetails;
