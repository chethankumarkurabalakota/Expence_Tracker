export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  category: string;
}

export interface MonthlyBudget {
  amount: number;
  spent: number;
  remaining: number;
}

export const DEFAULT_CATEGORIES = {
  income: [
    'Salary',
    'Freelance',
    'Investments',
    'Rental Income',
    'Side Business',
    'Bonus',
    'Other Income'
  ],
  expense: [
    'Housing',
    'Transportation',
    'Food & Dining',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Travel',
    'Insurance',
    'Savings',
    'Other'
  ]
};