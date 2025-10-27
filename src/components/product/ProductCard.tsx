"use client";

import { Mobile } from "@/types/mobile";
import { Battery, Camera, Cpu, Monitor, Smartphone, Star, Zap, Signal, ExternalLink, Search, Plus, Check } from "lucide-react";
import { useState, memo, useCallback } from "react";
import PhoneDetailModal from "./PhoneDetailModal";
import { useComparison } from "@/contexts/ComparisonContext";

interface ProductCardProps {
  phone: Mobile;
}

function ProductCard({ phone }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
  const inComparison = isInComparison(phone.model);

  const handleGoogleSearch = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const searchQuery = encodeURIComponent(`${phone.model} specifications price`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  }, [phone.model]);

  const handleCompareToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(phone.model);
    } else {
      const success = addToComparison(phone);
      if (!success && !inComparison) {
        // Could show a toast notification here
        alert("You can only compare up to 3 phones at a time");
      }
    }
  }, [inComparison, phone, addToComparison, removeFromComparison]);

  return (
    <>
      <div 
        className={`premium-card glass group rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg cursor-pointer transition-all duration-300 ${
          inComparison 
            ? 'border-2 border-emerald-500/50 ring-2 ring-emerald-500/15' 
            : 'border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
        onClick={() => setShowModal(true)}
      >
      {/* Phone Icon/Image with Soft Gradient - Responsive */}
      <div className="relative h-24 sm:h-32 bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-pink-100/40 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-purple-50/20 dark:from-indigo-900/10 dark:to-purple-900/10 backdrop-blur-sm"></div>
        <div className="relative z-10 group-hover:scale-105 transition-transform duration-500">
          <Smartphone size={48} className="text-slate-700 dark:text-slate-300 drop-shadow-lg sm:w-14 sm:h-14" strokeWidth={1.5} />
        </div>
        
        {/* Floating badges - Responsive */}
        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex flex-col gap-1 sm:gap-1.5">
          {phone.rating >= 85 && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1 shadow-lg">
              <Star size={9} fill="white" className="text-white" />
              <span className="text-white text-[9px] sm:text-[10px] font-bold">Top</span>
            </div>
          )}
          {inComparison && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1 shadow-lg animate-slideUp">
              <Check size={9} className="text-white" />
              <span className="text-white text-[9px] sm:text-[10px] font-bold">Added</span>
            </div>
          )}
        </div>
      </div>

      {/* Phone Name and Brand - Responsive */}
      <h3 className="font-semibold text-sm sm:text-[16px] text-slate-800 dark:text-slate-100 mb-1 sm:mb-1.5 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all leading-snug">
        {phone.model}
      </h3>
      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 capitalize mb-3 sm:mb-4 font-normal uppercase tracking-wide">{phone.brand_name}</p>

      {/* Key Specs with Icons - Responsive Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-100 bg-slate-100/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-2.5">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-1 sm:p-1.5 rounded-md flex-shrink-0">
            <Camera size={10} className="text-white sm:w-3 sm:h-3" />
          </div>
          <span className="text-[11px] sm:text-[13px] font-normal truncate">{phone.primary_camera_rear}MP</span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-100 bg-slate-100/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-2.5">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-1 sm:p-1.5 rounded-md flex-shrink-0">
            <Battery size={10} className="text-white sm:w-3 sm:h-3" />
          </div>
          <span className="text-[11px] sm:text-[13px] font-normal truncate">
            {phone.battery_capacity}
            {phone.fast_charging_available && <span className="text-emerald-500">⚡</span>}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-100 bg-slate-100/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-2.5">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-1 sm:p-1.5 rounded-md flex-shrink-0">
            <Cpu size={10} className="text-white sm:w-3 sm:h-3" />
          </div>
          <span className="text-[11px] sm:text-[13px] font-normal truncate">
            {phone.ram_capacity}+{phone.internal_memory}GB
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-100 bg-slate-100/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-2.5">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-1 sm:p-1.5 rounded-md flex-shrink-0">
            <Monitor size={10} className="text-white sm:w-3 sm:h-3" />
          </div>
          <span className="text-[11px] sm:text-[13px] font-normal truncate">
            {phone.screen_size}&quot; {phone.refresh_rate}Hz
          </span>
        </div>
      </div>

      {/* Features Badges - Compact & Responsive */}
      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
        {phone.has_5g && (
          <span className="px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[9px] sm:text-[10px] rounded-full font-bold shadow-lg flex items-center gap-0.5">
            <Signal size={8} />
            5G
          </span>
        )}
        {phone.refresh_rate >= 120 && (
          <span className="px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[9px] sm:text-[10px] rounded-full font-bold shadow-lg flex items-center gap-0.5">
            <Zap size={8} />
            {phone.refresh_rate}Hz
          </span>
        )}
        {phone.fast_charging >= 50 && (
          <span className="px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] sm:text-[10px] rounded-full font-bold shadow-lg flex items-center gap-0.5">
            <Zap size={8} />
            {phone.fast_charging}W
          </span>
        )}
      </div>

      {/* Price and Rating - Responsive */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700 mb-3 sm:mb-4">
        <div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-normal mb-0.5 sm:mb-1">Price</div>
          <div className="text-sm sm:text-[17px] font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            ₹{phone.price.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-normal mb-0.5 sm:mb-1">Rating</div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Star size={12} fill="#f59e0b" className="text-amber-500 sm:w-3.5 sm:h-3.5" />
            <span className="text-sm sm:text-[17px] font-bold text-amber-600 dark:text-amber-500">
              {phone.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Responsive */}
      <div className="flex gap-1.5 sm:gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2 sm:py-2.5 rounded-lg font-medium text-[11px] sm:text-[13px] transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5"
        >
          <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
          Details
        </button>
        <button
          onClick={handleCompareToggle}
          className={`backdrop-blur-sm p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-95 ${
            inComparison 
              ? "bg-emerald-500/90 hover:bg-emerald-500 text-white" 
              : canAddMore 
                ? "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200" 
                : "bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-500"
          }`}
          title={inComparison ? "Remove from comparison" : "Add to compare"}
          disabled={!canAddMore && !inComparison}
        >
          {inComparison ? <Check size={12} className="sm:w-3.5 sm:h-3.5" /> : <Plus size={12} className="sm:w-3.5 sm:h-3.5" />}
        </button>
        <button
          onClick={handleGoogleSearch}
          className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 backdrop-blur-sm text-slate-700 dark:text-slate-200 p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-95"
          title="Search on Google"
        >
          <Search size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>

      {/* Modal */}
      {showModal && (
        <PhoneDetailModal 
          phone={phone} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}

export default memo(ProductCard, (prevProps, nextProps) => {
  return prevProps.phone.model === nextProps.phone.model;
});


