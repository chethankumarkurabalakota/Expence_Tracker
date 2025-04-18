import React, { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseChart } from './components/ExpenseChart';
import { MonthlyAlert } from './components/MonthlyAlert';
import { Wallet, TrendingUp, TrendingDown, Edit2, Check, X } from 'lucide-react';
import type { Transaction, MonthlyBudget } from './types';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget>({
    amount: 5000,
    spent: 0,
    remaining: 5000
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => {
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setMonthlyBudget(prev => ({
      ...prev,
      spent: totalExpenses,
      remaining: prev.amount - totalExpenses
    }));
  }, [transactions]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleUpdateBudget = (amount: number) => {
    setMonthlyBudget(prev => ({
      ...prev,
      amount,
      remaining: amount - prev.spent
    }));
  };

  const handleEditTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setEditingId(id);
      setEditAmount(transaction.amount.toString());
    }
  };

  const handleSaveEdit = (id: string) => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount >= 0) {
      setTransactions(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, amount }
            : t
        )
      );
    }
    setEditingId(null);
    setEditAmount('');
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Wallet className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp size={24} />
                <h3 className="text-lg font-semibold">Total Income</h3>
              </div>
              {editingId === 'income' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit('income')}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditAmount('');
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditTransaction('income')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>
            {editingId === 'income' ? (
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            ) : (
              <p className="text-2xl font-bold mt-2">${totalIncome.toFixed(2)}</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <TrendingDown size={24} />
                <h3 className="text-lg font-semibold">Total Expenses</h3>
              </div>
              {editingId === 'expenses' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit('expenses')}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditAmount('');
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditTransaction('expenses')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>
            {editingId === 'expenses' ? (
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            ) : (
              <p className="text-2xl font-bold mt-2">${totalExpenses.toFixed(2)}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-blue-600">
              <Wallet size={24} />
              <h3 className="text-lg font-semibold">Balance</h3>
            </div>
            <p className={`text-2xl font-bold mt-2 ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(totalIncome - totalExpenses).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <MonthlyAlert budget={monthlyBudget} onUpdateBudget={handleUpdateBudget} />
            <ExpenseForm onAddTransaction={handleAddTransaction} />
          </div>
          <ExpenseChart transactions={transactions} />
        </div>
      </main>
    </div>
  );
}

export default App;