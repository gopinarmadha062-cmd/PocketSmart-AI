import React from 'react';
import { CalculationTableRow } from '../types';
import { Calculator } from 'lucide-react';

interface CalculationTableProps {
  rows: CalculationTableRow[];
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
}

export const CalculationTable: React.FC<CalculationTableProps> = ({
  rows,
  totalBudget,
  allocatedBudget,
  remainingBudget,
}) => {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs mt-6">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Budget Allocation & Calculation Table (INR)
          </h4>
        </div>
        <span className="text-xs text-slate-500 font-medium">Real-Time Cost Breakdown</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100/75 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Items Count</th>
              <th className="py-3 px-4 text-right">Total Cost</th>
              <th className="py-3 px-4 text-right">% of Total Budget</th>
              <th className="py-3 px-4 w-36">Visual Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((row, idx) => {
              const pct = Math.min(100, Math.max(0, row.percentage_of_budget || 0));
              return (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900 capitalize">
                    {row.category}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 font-mono">
                    {row.items_count}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900 font-mono">
                    ₹{row.total_cost.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-blue-700 font-mono">
                    {pct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-bold border-t-2 border-slate-200 text-slate-900">
              <td className="py-3 px-4">Total Allocated</td>
              <td className="py-3 px-4 text-center font-mono">
                {rows.reduce((sum, r) => sum + (r.items_count || 0), 0)}
              </td>
              <td className="py-3 px-4 text-right text-blue-600 font-mono">
                ₹{allocatedBudget.toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-4 text-right font-mono text-slate-700">
                {totalBudget > 0 ? ((allocatedBudget / totalBudget) * 100).toFixed(1) : 0}%
              </td>
              <td className="py-3 px-4">
                <span className="text-xs font-normal text-emerald-600">
                  Buffer: ₹{remainingBudget.toLocaleString('en-IN')}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
