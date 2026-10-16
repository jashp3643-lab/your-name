// Synthetic demo data. Nothing here is real: the names, numbers and amounts are invented.
// Dates are generated relative to the moment the data is first created (then stored), so the
// "Current Month", "Last Month" and "Last 3 Months" filters always have something to show.

import { addYMD } from './format.js';

const DAY = 86400000;

// [year, monthIndex, day, hour, minute, channel, direction, amount, counterparty]
// Note: month index 9 is October, 8 is September, 7 is August
const SAVINGS_ROWS = [
  [2026, 9, 15, 15, 30, 'IMPS', 'D', 10000.0, '6204817395'],
  [2026, 9, 15, 9, 20, 'UPI', 'D', 450.0, '7403918265'],
  [2026, 9, 14, 18, 40, 'UPI', 'D', 602.0, '8890127453'],
  [2026, 9, 13, 14, 15, 'UPI', 'D', 1200.0, '9988214403'],
  [2026, 9, 12, 10, 20, 'UPI', 'D', 850.0, '9120384756'],
  [2026, 9, 11, 16, 50, 'UPI', 'D', 1400.0, '7403918265'],
  [2026, 9, 10, 12, 10, 'UPI', 'D', 1150.0, '8821035517'],
  [2026, 9, 8, 19, 35, 'UPI', 'D', 1850.0, '9120384756'],
  [2026, 9, 6, 11, 15, 'UPI', 'D', 1450.0, '7403918265'],
  [2026, 9, 5, 17, 30, 'UPI', 'D', 348.0, '9988214403'],
  [2026, 9, 5, 9, 15, 'UPI', 'D', 650.0, '8821035517'],
  [2026, 9, 3, 14, 10, 'UPI', 'D', 1200.0, '8890127453'],
  [2026, 9, 1, 11, 20, 'UPI', 'D', 850.0, '9120384756'],
  [2026, 8, 28, 17, 40, 'UPI', 'D', 1450.0, '7403918265'],
  [2026, 8, 25, 13, 10, 'UPI', 'D', 1200.0, '8821035517'],
  [2026, 8, 22, 16, 20, 'UPI', 'D', 1800.0, '9120384756'],
  [2026, 8, 20, 10, 50, 'UPI', 'D', 650.0, '9988214403'],
  [2026, 8, 18, 19, 30, 'UPI', 'D', 1400.0, '7403918265'],
  [2026, 8, 15, 14, 15, 'UPI', 'D', 950.0, '8890127453'],
  [2026, 8, 12, 11, 40, 'UPI', 'D', 2500.0, '9120384756'],
  [2026, 8, 10, 18, 10, 'UPI', 'D', 1150.0, '9988214403'],
  [2026, 8, 8, 9, 20, 'UPI', 'D', 850.0, '8821035517'],
  [2026, 8, 5, 16, 45, 'UPI', 'D', 2200.0, '7403918265'],
  [2026, 8, 3, 12, 30, 'UPI', 'D', 1500.0, '9120384756'],
  [2026, 7, 30, 18, 20, 'UPI', 'D', 2200.0, '7403918265'],
  [2026, 7, 28, 15, 30, 'UPI', 'D', 2800.0, '9120384756'],
  [2026, 7, 26, 10, 0, 'NEFT', 'C', 45000.0, '2260194738'],
];

const SALARY_ROWS = [
  [3, 10, 0, 'NEFT', 'C', 85000.0, '2260194738'],
  [10, 16, 20, 'IMPS', 'D', 12000.0, '5530971246'],
  [26, 9, 15, 'UPI', 'D', 3200.0, '8821035517'],
  [33, 10, 0, 'NEFT', 'C', 85000.0, '2260194738'],
  [47, 14, 40, 'IMPS', 'D', 20000.0, '5530971246'],
  [63, 10, 0, 'NEFT', 'C', 85000.0, '2260194738'],
];

const NARRATIONS = [
  'IMPS/PURNAS/628915002814/ICICI/Direct/Sent',
  'UPI/DR/217967026832/Flipkart/YESB/paytm-5650/Sent',
  'UPI/DR/228901438910/Swiggy/HDFC/paytm-1021/Sent',
  'UPI/DR/239012489012/Amazon/ICIC/gpay-8821/Sent',
  'UPI/DR/240182940182/Zomato/AXIS/phonepe-912/Sent',
  'UPI/DR/251029384910/Blinkit/KKBK/paytm-3312/Sent',
  'UPI/DR/262103948501/Uber/BARB/uber-4410/Sent',
  'UPI/DR/273214059612/Myntra/SBIN/paytm-8802/Sent',
  'UPI/DR/284325160723/TataCliq/HDFC/gpay-1923/Sent',
  'UPI/DR/295436271834/Zepto/YESB/paytm-7741/Sent',
  'UPI/DR/306547382945/BigBasket/ICIC/phonepe-5521/Sent',
  'UPI/DR/317658493056/BookMyShow/AXIS/paytm-6632/Sent',
  'UPI/DR/328769504167/Dominos/SBIN/gpay-2244/Sent',
  'UPI/DR/339870615278/Dunzo/KKBK/paytm-9912/Sent',
  'UPI/DR/340981726389/MakeMyTrip/HDFC/mmt-3301/Sent',
  'UPI/DR/351092837490/OlaCabs/YESB/ola-7712/Sent',
  'UPI/DR/362103948501/PaytmMall/ICIC/paytm-1123/Sent',
  'UPI/DR/373214059612/Pharmeasy/AXIS/phonepe-6651/Sent',
  'UPI/DR/384325160723/CultFit/SBIN/gpay-3341/Sent',
  'UPI/DR/395436271834/Nykaa/BARB/paytm-8822/Sent',
  'UPI/DR/406547382945/ApolloPharmacy/HDFC/apollo-991/Sent',
  'UPI/DR/417658493056/Ajio/YESB/ajio-4412/Sent',
  'UPI/DR/428769504167/Decathlon/ICIC/deca-5523/Sent',
  'UPI/DR/439870615278/Croma/AXIS/phonepe-1102/Sent',
  'UPI/DR/440981726389/UrbanCompany/SBIN/uc-7734/Sent',
  'UPI/DR/451092837490/RelianceRetail/KKBK/paytm-6644/Sent',
  'NEFT/INW/20260826982104/INFOSYS/SALARY',
];

function describe(channel, dir, party, narration) {
  const verb = dir === 'D' ? 'TRANSFER TO' : 'TRANSFER FROM';
  return narration ? `${channel}- ${verb} ${party} ${narration}` : `${channel}- ${verb} ${party}`;
}

function buildTxns(accountId, rows, currentBalance) {
  const out = [];
  let balance = currentBalance;
  rows.forEach(([y, m, d, h, min, channel, dir, amount, party], i) => {
    const date = new Date(y, m, d, h, min, 0, 0);
    const narration = NARRATIONS[i] || '';
    out.push({
      id: `${accountId}-t${String(i + 1).padStart(3, '0')}`,
      accountId,
      date: date.toISOString(),
      channel,
      direction: dir === 'D' ? 'debit' : 'credit',
      amount,
      description: describe(channel, dir, party, narration),
      narration,
      balanceAfter: Math.round(balance * 100) / 100,
    });
    // walk backwards: balance before this transaction
    balance = dir === 'D' ? balance + amount : balance - amount;
  });
  return out;
}

export function createSeed(now = new Date()) {
  const savingsBalance = 2352.0; // ₹2,350 final balance

  const transactions = [
    ...buildTxns('a1', SAVINGS_ROWS, savingsBalance),
  ];

  const fdStart1 = new Date(2026, 7, 6); // 06/08/2026
  fdStart1.setHours(0, 0, 0, 0);
  const fdMaturity1 = addYMD(fdStart1, 1, 2, 18); // 24/10/2027

  const fdStart2 = new Date(2026, 8, 22); // 22/09/2026
  fdStart2.setHours(0, 0, 0, 0);
  const fdMaturity2 = addYMD(fdStart2, 1, 2, 18); // 10/12/2027

  const fdStart3 = new Date(2026, 9, 8); // 08/10/2026
  fdStart3.setHours(0, 0, 0, 0);
  const fdMaturity3 = addYMD(fdStart3, 1, 2, 18); // 26/12/2027

  return {
    version: 8,
    seededAt: now.toISOString(),
    user: { id: 'u1', name: 'Kuldeep Trivedi', username: 'demo.user', mobile: '98XXXXXX21', email: 'kuldeep***@example.com' },
    accounts: [
      { id: 'a1', type: 'Savings Account', number: '50218047561', balance: savingsBalance, branch: 'BORIVLI(EAST),MUMBAI' },
    ],
    transactions,
    deposits: [
      {
        id: 'fd1',
        variant: 'Regular FD',
        number: '50219309048',
        linkedAccountId: 'a1',
        principal: 60000,
        rate: 6.45,
        startDate: fdStart1.toISOString(),
        maturityDate: fdMaturity1.toISOString(),
        currentValue: 60746.65,
        interest: 746.65,
        maturityAmount: 64858.00,
        currency: 'INR',
        lienMarked: false,
        lienAmount: 0,
        branch: 'BORIVLI(EAST),MUMBAI',
        branchCode: '04666',
        ownership: 'Single',
        interestPayout: 'At Maturity',
        maturityInstruction: 'Auto Renewal',
      },
      {
        id: 'fd2',
        variant: 'Regular FD',
        number: '50219309049',
        linkedAccountId: 'a1',
        principal: 54500,
        rate: 6.45,
        startDate: fdStart2.toISOString(),
        maturityDate: fdMaturity2.toISOString(),
        currentValue: 54729.83,
        interest: 229.83,
        maturityAmount: 58912.67,
        currency: 'INR',
        lienMarked: false,
        lienAmount: 0,
        branch: 'BORIVLI(EAST),MUMBAI',
        branchCode: '04666',
        ownership: 'Single',
        interestPayout: 'At Maturity',
        maturityInstruction: 'Auto Renewal',
      },
      {
        id: 'fd3',
        variant: 'Regular FD',
        number: '50219309050',
        linkedAccountId: 'a1',
        principal: 60000,
        rate: 6.45,
        startDate: fdStart3.toISOString(),
        maturityDate: fdMaturity3.toISOString(),
        currentValue: 60084.14,
        interest: 84.14,
        maturityAmount: 64858.00,
        currency: 'INR',
        lienMarked: false,
        lienAmount: 0,
        branch: 'BORIVLI(EAST),MUMBAI',
        branchCode: '04666',
        ownership: 'Single',
        interestPayout: 'At Maturity',
        maturityInstruction: 'Auto Renewal',
      },
    ],
    nominees: {
      fd1: {
        modeOfOperation: 'Single',
        nominationType: 'Simultaneous',
        list: [{ id: 'n1', name: 'Varsha Trivedi', relationship: 'Mother', sharePct: 100 }],
      },
      fd2: {
        modeOfOperation: 'Single',
        nominationType: 'Simultaneous',
        list: [{ id: 'n2', name: 'Varsha Trivedi', relationship: 'Mother', sharePct: 100 }],
      },
      fd3: {
        modeOfOperation: 'Single',
        nominationType: 'Simultaneous',
        list: [{ id: 'n3', name: 'Varsha Trivedi', relationship: 'Mother', sharePct: 100 }],
      },
    },
    loans: [],
    beneficiaries: [
      { id: 'b1', name: 'Rohan Kapoor', account: '60112233445', ifsc: 'NOVA0001001', nickname: 'Rohan', scope: 'other' },
      { id: 'b2', name: 'Priya Nair', account: '50219887766', ifsc: 'DEMO0000101', nickname: 'Priya', scope: 'within' },
      { id: 'b3', name: 'S Iyer', account: '70445566778', ifsc: 'ARYA0002300', nickname: 'Landlord', scope: 'other' },
    ],
    notifications: [
      { id: 'nt1', title: 'Salary credited', body: 'NEFT credit received in your Account.', at: new Date(now.getTime() - 3 * DAY).toISOString(), read: false },
      { id: 'nt2', title: 'Never share your PIN', body: 'YONO SBI will never ask for your MPIN or OTP.', at: new Date(now.getTime() - 6 * DAY).toISOString(), read: false },
      { id: 'nt3', title: 'Fixed deposit created', body: 'Your Fixed Deposit has been opened successfully.', at: new Date(now.getTime() - 8 * DAY).toISOString(), read: true },
    ],
    statementRequests: [],
    settings: { hideBalances: true },
  };
}
