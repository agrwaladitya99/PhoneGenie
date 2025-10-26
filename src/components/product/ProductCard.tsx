import { Mobile } from "@/types/mobile";
import { Battery, Camera, Cpu, Monitor, Smartphone } from "lucide-react";

interface ProductCardProps {
  phone: Mobile;
}

export default function ProductCard({ phone }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200">
      {/* Phone Icon/Image Placeholder */}
      <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
        <Smartphone size={64} className="text-blue-600" />
      </div>

      {/* Phone Name and Brand */}
      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
        {phone.model}
      </h3>
      <p className="text-sm text-gray-600 capitalize mb-3">{phone.brand_name}</p>

      {/* Key Specs */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center text-gray-700">
          <Camera size={16} className="mr-2 text-blue-600" />
          <span>{phone.primary_camera_rear}MP Camera</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Battery size={16} className="mr-2 text-green-600" />
          <span>
            {phone.battery_capacity}mAh
            {phone.fast_charging_available ? ` (${phone.fast_charging}W)` : ""}
          </span>
        </div>
        <div className="flex items-center text-gray-700">
          <Cpu size={16} className="mr-2 text-purple-600" />
          <span>
            {phone.ram_capacity}GB + {phone.internal_memory}GB
          </span>
        </div>
        <div className="flex items-center text-gray-700">
          <Monitor size={16} className="mr-2 text-orange-600" />
          <span>
            {phone.screen_size}" {phone.refresh_rate}Hz
          </span>
        </div>
      </div>

      {/* Features Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {phone.has_5g && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            5G
          </span>
        )}
        {phone.refresh_rate >= 120 && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
            {phone.refresh_rate}Hz
          </span>
        )}
        {phone.fast_charging >= 50 && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            Fast Charge
          </span>
        )}
      </div>

      {/* Price and Rating */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div>
          <div className="text-2xl font-bold text-green-600">
            ₹{phone.price.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Rating</div>
          <div className="text-lg font-bold text-yellow-600">
            {phone.rating}/100
          </div>
        </div>
      </div>
    </div>
  );
}


