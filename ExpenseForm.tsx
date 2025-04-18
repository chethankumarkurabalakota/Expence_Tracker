import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Transaction } from '../types';
import { DEFAULT_CATEGORIES } from '../types';

interface ExpenseFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function ExpenseForm({ onAddTransaction }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: new Date().toISOString(),
    });
    setAmount('');
    setDescription('');
    setCategory('');
    setShowCustomCategory(false);
  };

  const categories = type === 'income' ? DEFAULT_CATEGORIES.income : DEFAULT_CATEGORIES.expense;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as 'income' | 'expense');
              setCategory('');
              setShowCustomCategory(false);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <div className="flex gap-2">
          {!showCustomCategory ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="custom">+ Custom Category</option>
            </select>
          ) : (
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter custom category"
              required
            />
          )}
          <button
            type="button"
            onClick={() => {
              setShowCustomCategory(!showCustomCategory);
              setCategory('');
            }}
            className="mt-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            {showCustomCategory ? 'Select' : 'Custom'}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        <PlusCircle size={20} />
        Add Transaction
      </button>
    </form>
  );
}