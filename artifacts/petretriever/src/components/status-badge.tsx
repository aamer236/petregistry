import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { PetStatus } from "@workspace/api-client-react";

export function StatusBadge({ status, className }: { status: PetStatus; className?: string }) {
  if (status === PetStatus.Verified) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200", className)}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        Verified
      </span>
    );
  }
  
  if (status === PetStatus.Pending) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200", className)}>
        <Clock className="w-3.5 h-3.5" />
        Pending Vet Review
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200", className)}>
      <AlertCircle className="w-3.5 h-3.5" />
      Incomplete
    </span>
  );
}
