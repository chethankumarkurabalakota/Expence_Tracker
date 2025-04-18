import React, { useState } from 'react';
import { AlertTriangle, Edit2, Check, X } from 'lucide-react';
import type { MonthlyBudget } from '../types';

interface MonthlyAlertProps {
  budget: MonthlyBudget;
  onUpdateBudget: (amount: number) => void;
}

export function MonthlyAlert({ budget, onUpdateBudget }: MonthlyAlertProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(budget.amount.toString());
  const percentage = (budget.spent / budget.amount) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateBudget(amount);
      setIsEditing(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Monthly Budget Status</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Edit2 size={20} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="text-green-600 hover:text-green-800"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewAmount(budget.amount.toString());
              }}
              className="text-red-600 hover:text-red-800"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            Budget: 
            {isEditing ? (
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-32 px-2 py-1 border rounded-md"
                min="0"
                step="100"
              />
            ) : (
              <span className="font-semibold">${budget.amount}</span>
            )}
          </span>
          <span>Spent: <span className="font-semibold">${budget.spent}</span></span>
          <span>Remaining: <span className="font-semibold">${budget.remaining}</span></span>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${percentage}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            ></div>
          </div>
        </div>
        {percentage > 90 && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertTriangle size={20} />
            <span>Warning: You've used {percentage.toFixed(1)}% of your monthly budget!</span>
          </div>
        )}
        {percentage > 75 && percentage <= 90 && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-md">
            <AlertTriangle size={20} />
            <span>Caution: You've used {percentage.toFixed(1)}% of your monthly budget.</span>
          </div>
        )}
      </div>
    </div>
  );
}