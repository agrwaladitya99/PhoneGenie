import { Mobile } from "@/types/mobile";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  phones: Mobile[];
}

export default function ProductGrid({ phones }: ProductGridProps) {
  if (phones.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {phones.map((phone, index) => (
        <ProductCard key={`${phone.model}-${index}`} phone={phone} />
      ))}
    </div>
  );
}


