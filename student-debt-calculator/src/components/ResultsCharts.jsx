import { Paper, Typography, Grid2, Box } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ResultsCharts = ({ loanAmount, interestRate, monthlyPayment, major, city }) => {
  // Calculate loan amortization schedule
  const calculateAmortization = () => {
    if (!loanAmount || !interestRate || !monthlyPayment) return [];

    const monthlyRate = (interestRate / 100) / 12;
    let balance = loanAmount;
    const schedule = [];
    let month = 0;

    while (balance > 0 && month < 480) {
      const interest = balance * monthlyRate;
      const principal = Math.min(monthlyPayment - interest, balance);
      balance = balance - principal;

      schedule.push({
        month: month + 1,
        balance: Math.max(0, balance),
        payment: monthlyPayment,
        principal,
        interest,
      });

      month++;
    }

    return schedule;
  };

  const amortizationSchedule = calculateAmortization();


  const totalPaid = amortizationSchedule.reduce((sum, month) => sum + month.interest + month.principal, 0);
  const totalInterest = amortizationSchedule.reduce((sum, month) => sum + Math.min(month.interest, month.payment), 0);

  return (
    <Grid2 container spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Grid2 item xs={12} md={4} sx={{ width: '82%', padding: 1 }}>
        <Paper sx={{ p: 2, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Loan Summary
          </Typography>
          {loanAmount && interestRate && monthlyPayment ? (
            <>
              <Typography variant="body1">
                Payoff Period: {`${Math.floor(amortizationSchedule.length / 12)} years and ${Math.round(amortizationSchedule.length % 12)} months`}
              </Typography>
              <Typography variant="body1">
                Total Amount: ${loanAmount.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Total Interest: ${totalInterest.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Total Paid: ${totalPaid.toLocaleString()}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
              Enter loan details to view the summary
            </Typography>
          )}
        </Paper>
      </Grid2>
    <Grid2 container spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
      {/* Loan Amortization Chart */}
      {loanAmount && interestRate && monthlyPayment ? (
        <Grid2 item xs={12}>
          <Paper sx={{ p: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Loan Amortization Schedule
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <LineChart
                width={800}
                height={400}
                data={amortizationSchedule}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(month) => `${Math.floor(month / 12)}`}
                  allowDataOverflow
                  ticks={Array.from({length: 26}, (_, i) => i * 12)}
                  stroke="#fff"
                />
                <YAxis stroke="#fff" />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                  labelFormatter={(month) => `Year ${Math.floor(month / 12)}, Month ${month % 12 + 1}`}
                  contentStyle={{
                    backgroundColor: '#424242',
                    border: '1px solid #666',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#8884d8" 
                  name="Remaining Balance"
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return payload.month % 12 === 0 ? (
                      <circle cx={cx} cy={cy} r={4} fill="#8884d8" />
                    ) : null;
                  }}
                />
              </LineChart>
            </Box>
          </Paper>
        </Grid2>
      ) : (
        <Grid2 item xs={12}>
          <Paper sx={{ p: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Loan Amortization Schedule
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              Enter loan amount, interest rate, and monthly payment to view the amortization schedule
            </Typography>
          </Paper>
        </Grid2>
      )}

      {/* Monthly Income vs Expenses Chart */}
      <Grid2 item xs={12}>
        <Paper sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Monthly Income vs. Expenses
          </Typography>
          {major && city ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <BarChart 
                width={800}
                height={400} 
                activeBar={false}
                data={[{
                  year: 1,
                  monthlySalary: major.salary/12,
                  monthlyPayment: monthlyPayment || 0,
                  livingExpenses: city.costOfLiving,
                  taxes: (major.salary/12) * 0.3
                }]}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                <XAxis dataKey="year" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: '#424242',
                    border: '1px solid #666',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
                <Bar name="Monthly Income" dataKey="monthlySalary" fill="#82ca9d" active={false} />
                {monthlyPayment > 0 && (
                  <Bar name="Loan Payment" stackId="expenses" dataKey="monthlyPayment" fill="#8884d8" active={false} />
                )}
                <Bar name="Living Expenses" stackId="expenses" dataKey="livingExpenses" fill="#ff8042" active={false} />
                <Bar name="Est. Taxes" stackId="expenses" dataKey="taxes" fill="#4B7BE5" active={false} />
              </BarChart>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                {!major && !city ? (
                  'Select a major and city to view income comparison'
                ) : !major ? (
                  'Select a major to view income comparison'
                ) : (
                  'Select a city to view income comparison'
                )}
              </Typography>
              {major && city && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Optional: Add loan details to include monthly payments
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Grid2>
    </Grid2>
    </Grid2>
  );
};

export default ResultsCharts;
