"use client";

import { Mobile } from "@/types/mobile";
import { 
  X, 
  Camera, 
  Battery, 
  Cpu, 
  Monitor, 
  Smartphone, 
  Star, 
  Zap, 
  Signal,
  HardDrive,
  Wifi,
  Globe,
  Disc,
  Radio,
  ExternalLink
} from "lucide-react";
import { useEffect } from "react";

interface PhoneDetailModalProps {
  phone: Mobile;
  onClose: () => void;
}

export default function PhoneDetailModal({ phone, onClose }: PhoneDetailModalProps) {
  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleGoogleSearch = () => {
    const searchQuery = encodeURIComponent(`${phone.model} specifications price`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto glass rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Responsive */}
        <button
          onClick={onClose}
          className="sticky top-2 sm:top-4 left-full ml-2 sm:ml-4 z-10 p-2 sm:p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full backdrop-blur-xl transition-all duration-300 hover:rotate-90 hover:scale-105"
        >
          <X size={20} className="text-slate-800 dark:text-slate-100 sm:w-6 sm:h-6" />
        </button>

        <div className="p-4 sm:p-8">
          {/* Header Section - Responsive */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Phone Icon */}
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-pink-100/40 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto sm:mx-0">
              <Smartphone size={48} className="text-slate-700 dark:text-slate-300 drop-shadow-lg sm:w-16 sm:h-16" strokeWidth={1.5} />
            </div>

            {/* Title and Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {phone.model}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 capitalize mb-4 sm:mb-5 font-normal uppercase tracking-wide">
                {phone.brand_name}
              </p>

              {/* Price and Rating - Responsive */}
              <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8">
                <div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal mb-1 sm:mb-1.5">Price</div>
                  <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                    ₹{phone.price.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal mb-1 sm:mb-1.5">Rating</div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Star size={16} fill="#f59e0b" className="text-amber-500 sm:w-5 sm:h-5" />
                    <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-500">{phone.rating}</span>
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">/100</span>
                  </div>
                </div>
              </div>

              {/* Google Search Button - Responsive */}
              <button
                onClick={handleGoogleSearch}
                className="mt-4 sm:mt-5 group relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg sm:rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg sm:rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 text-white">
                  <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Search on Google
                  <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px]" />
                </div>
              </button>
            </div>
          </div>

          {/* Feature Badges - Responsive */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-6 sm:mb-8 justify-center sm:justify-start">
            {phone.has_5g && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs sm:text-[14px] rounded-full font-medium shadow-md flex items-center gap-1.5 sm:gap-2">
                <Signal size={14} className="sm:w-4 sm:h-4" />
                5G Enabled
              </span>
            )}
            {phone.refresh_rate >= 120 && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs sm:text-[14px] rounded-full font-medium shadow-md flex items-center gap-1.5 sm:gap-2">
                <Zap size={14} className="sm:w-4 sm:h-4" />
                {phone.refresh_rate}Hz Display
              </span>
            )}
            {phone.fast_charging >= 50 && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-[14px] rounded-full font-medium shadow-md flex items-center gap-1.5 sm:gap-2">
                <Zap size={14} className="sm:w-4 sm:h-4" />
                {phone.fast_charging}W Fast Charging
              </span>
            )}
            {phone.rating >= 85 && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-[14px] rounded-full font-medium shadow-md flex items-center gap-1.5 sm:gap-2">
                <Star size={14} fill="white" className="sm:w-4 sm:h-4" />
                Premium Device
              </span>
            )}
          </div>

          {/* Detailed Specifications - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
            {/* Display Section - Responsive */}
            <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <Monitor size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">Display</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <SpecRow label="Screen Size" value={`${phone.screen_size}"`} />
                <SpecRow label="Resolution" value={`${phone.resolution_width}x${phone.resolution_height}`} />
                <SpecRow label="Refresh Rate" value={`${phone.refresh_rate}Hz`} />
              </div>
            </div>

            {/* Camera Section - Responsive */}
            <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <Camera size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">Camera</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <SpecRow label="Rear Camera" value={`${phone.primary_camera_rear}MP`} />
                <SpecRow label="Front Camera" value={`${phone.primary_camera_front}MP`} />
                <SpecRow label="Rear Cameras" value={`${phone.num_rear_cameras} cameras`} />
                <SpecRow label="Front Cameras" value={`${phone.num_front_cameras} camera(s)`} />
              </div>
            </div>

            {/* Performance Section - Responsive */}
            <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <Cpu size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">Performance</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <SpecRow label="Processor" value={phone.processor_brand} />
                <SpecRow label="RAM" value={`${phone.ram_capacity}GB`} />
                <SpecRow label="Storage" value={`${phone.internal_memory}GB`} />
                <SpecRow label="Expandable" value={phone.extended_memory_available ? `Up to ${phone.extended_memory_available}GB` : "No"} />
              </div>
            </div>

            {/* Battery Section - Responsive */}
            <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <Battery size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">Battery</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <SpecRow label="Capacity" value={`${phone.battery_capacity}mAh`} />
                <SpecRow label="Fast Charging" value={phone.fast_charging_available ? `${phone.fast_charging}W` : "Not Available"} />
              </div>
            </div>

            {/* Connectivity Section - Responsive */}
            <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <Wifi size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">Connectivity</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <SpecRow label="5G" value={phone.has_5g ? "Yes" : "No"} />
                <SpecRow label="NFC" value={phone.has_nfc ? "Yes" : "No"} />
                <SpecRow label="IR Blaster" value={phone.has_ir_blaster ? "Yes" : "No"} />
              </div>
            </div>

            {/* Physical Section - Responsive */}
            <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <HardDrive size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">Physical</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <SpecRow label="OS" value={`Android ${phone.os}`} />
                <SpecRow label="SIM Count" value={phone.num_cores} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-xs sm:text-[15px] py-0.5 sm:py-1">
      <span className="text-slate-600 dark:text-slate-400 font-normal">{label}</span>
      <span className="text-slate-800 dark:text-slate-100 font-medium">{value}</span>
    </div>
  );
}

