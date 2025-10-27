"use client";

import { Mobile } from "@/types/mobile";
import { 
  Camera, Battery, Cpu, Monitor, Smartphone, HardDrive, 
  Zap, Signal, RefreshCw, Award, TrendingUp, TrendingDown,
  Minus, DollarSign
} from "lucide-react";
import { memo } from "react";

interface ComparisonTableProps {
  phones: Mobile[];
}

interface ComparisonRow {
  category: string;
  icon: React.ReactNode;
  getValue: (phone: Mobile) => string | number;
  format?: (value: any) => string;
  higherIsBetter?: boolean;
  unit?: string;
}

function ComparisonTable({ phones }: ComparisonTableProps) {
  if (phones.length < 2) return null;

  const comparisonRows: ComparisonRow[] = [
    {
      category: "Price",
      icon: <DollarSign size={16} />,
      getValue: (p) => p.price,
      format: (v) => `₹${v.toLocaleString("en-IN")}`,
      higherIsBetter: false,
    },
    {
      category: "Overall Rating",
      icon: <Award size={16} />,
      getValue: (p) => p.rating,
      format: (v) => `${v}/100`,
      higherIsBetter: true,
    },
    {
      category: "Rear Camera",
      icon: <Camera size={16} />,
      getValue: (p) => p.primary_camera_rear,
      unit: "MP",
      higherIsBetter: true,
    },
    {
      category: "Front Camera",
      icon: <Camera size={16} />,
      getValue: (p) => p.primary_camera_front,
      unit: "MP",
      higherIsBetter: true,
    },
    {
      category: "Battery",
      icon: <Battery size={16} />,
      getValue: (p) => p.battery_capacity,
      unit: "mAh",
      higherIsBetter: true,
    },
    {
      category: "Fast Charging",
      icon: <Zap size={16} />,
      getValue: (p) => p.fast_charging_available ? (p.fast_charging || "Yes") : "No",
      format: (v) => typeof v === "number" ? `${v}W` : v,
      higherIsBetter: true,
    },
    {
      category: "RAM",
      icon: <Cpu size={16} />,
      getValue: (p) => p.ram_capacity,
      unit: "GB",
      higherIsBetter: true,
    },
    {
      category: "Storage",
      icon: <HardDrive size={16} />,
      getValue: (p) => p.internal_memory,
      unit: "GB",
      higherIsBetter: true,
    },
    {
      category: "Expandable Storage",
      icon: <HardDrive size={16} />,
      getValue: (p) => p.extended_memory_available ? `Up to ${p.extended_upto}GB` : "No",
    },
    {
      category: "Display Size",
      icon: <Monitor size={16} />,
      getValue: (p) => p.screen_size,
      unit: '"',
      higherIsBetter: true,
    },
    {
      category: "Refresh Rate",
      icon: <RefreshCw size={16} />,
      getValue: (p) => p.refresh_rate,
      unit: "Hz",
      higherIsBetter: true,
    },
    {
      category: "Resolution",
      icon: <Monitor size={16} />,
      getValue: (p) => `${p.resolution_width}×${p.resolution_height}`,
    },
    {
      category: "5G Support",
      icon: <Signal size={16} />,
      getValue: (p) => p.has_5g ? "Yes" : "No",
    },
    {
      category: "NFC",
      icon: <Smartphone size={16} />,
      getValue: (p) => p.has_nfc ? "Yes" : "No",
    },
    {
      category: "IR Blaster",
      icon: <Smartphone size={16} />,
      getValue: (p) => p.has_ir_blaster ? "Yes" : "No",
    },
  ];

  const determineWinner = (row: ComparisonRow): number | null => {
    const values = phones.map(p => row.getValue(p));
    
    // Handle string values (like "Yes"/"No")
    if (typeof values[0] === 'string' && !row.higherIsBetter) {
      return null; // No winner for categorical data
    }
    
    // Convert to numbers if needed
    const numericValues = values.map(v => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const parsed = parseFloat(v.replace(/[^\d.]/g, ''));
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    });

    if (row.higherIsBetter !== undefined) {
      if (row.higherIsBetter) {
        const maxValue = Math.max(...numericValues);
        return numericValues.indexOf(maxValue);
      } else {
        const minValue = Math.min(...numericValues);
        return numericValues.indexOf(minValue);
      }
    }
    
    return null;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="glass rounded-xl sm:rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg overflow-hidden min-w-[600px]">
        {/* Table Header */}
        <div className="grid gap-px bg-slate-200 dark:bg-slate-700" style={{ gridTemplateColumns: `200px repeat(${phones.length}, 1fr)` }}>
          {/* Category Column Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-white" />
              <span className="font-bold text-white text-sm">Specification</span>
            </div>
          </div>
          
          {/* Phone Headers */}
          {phones.map((phone, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-4"
            >
              <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">
                {phone.model}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 capitalize">
                {phone.brand_name}
              </div>
            </div>
          ))}
        </div>

        {/* Table Body */}
        {comparisonRows.map((row, rowIdx) => {
          const winnerIndex = determineWinner(row);
          
          return (
            <div 
              key={rowIdx}
              className="grid gap-px bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              style={{ gridTemplateColumns: `200px repeat(${phones.length}, 1fr)` }}
            >
              {/* Category Cell */}
              <div className="glass p-3 flex items-center gap-2 border-r border-slate-200 dark:border-slate-700">
                <div className="text-slate-600 dark:text-slate-400">
                  {row.icon}
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {row.category}
                </span>
              </div>

              {/* Value Cells */}
              {phones.map((phone, phoneIdx) => {
                const value = row.getValue(phone);
                const formattedValue = row.format 
                  ? row.format(value)
                  : `${value}${row.unit || ''}`;
                
                const isWinner = winnerIndex === phoneIdx;
                const isTied = winnerIndex === null && phones.every(p => row.getValue(p) === value);

                return (
                  <div
                    key={phoneIdx}
                    className={`glass p-3 flex items-center justify-center transition-all ${
                      isWinner 
                        ? 'bg-green-50/50 dark:bg-green-900/20 border-l-2 border-green-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-semibold ${
                        isWinner 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {formattedValue}
                      </span>
                      {isWinner && (
                        <TrendingUp size={12} className="text-green-600 dark:text-green-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Better spec</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp size={14} className="text-green-600" />
          <span>Winner in category</span>
        </div>
      </div>
    </div>
  );
}

export default memo(ComparisonTable);

