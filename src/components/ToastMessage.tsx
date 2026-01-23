"use client";

import { memo, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { ToastProps } from "@/types/index";


export const SuccessToast = memo(({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-[2rem] left-[50%] -translate-x-[50%] z-20000 animate-in fade-in slide-in-from-bottom-[2rem] duration-[400ms]">
      <div className="bg-[#134e4a] text-[#ffffff] px-[1.5rem] py-[1rem] rounded-[1.25rem] shadow-[0_20px_40px_-10px_rgba(13,148,136,0.4)] flex items-center gap-[1rem] min-w-[20rem]">
        <div className="bg-[#ffffff]/20 p-[0.5rem] rounded-[0.75rem]">
          <CheckCircle2 size="1.25rem" className="text-[#2dd4bf]" />
        </div>
        <div className="flex-1">
          <p className="text-[0.875rem] font-[800] leading-none">{message}</p>
        </div>
        <button onClick={onClose} className="p-[0.25rem] hover:bg-[#ffffff]/10 rounded-full transition-colors cursor-pointer">
          <X size="1.125rem" className="text-[#ffffff]/60" />
        </button>
      </div>
    </div>
  );
});

SuccessToast.displayName = "SuccessToast";