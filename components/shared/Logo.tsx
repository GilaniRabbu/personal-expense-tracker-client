import { Banknote } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="w-8 h-8 bg-[#07824D] text-white rounded-full flex items-center justify-center">
        <Banknote size={16} strokeWidth={2} absoluteStrokeWidth={true} />
      </span>
      <span className="font-bold uppercase text-[#07824D]">Expenses</span>
    </Link>
  );
};

export default Logo;
