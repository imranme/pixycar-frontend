"use client";

import { useRef, useEffect } from "react";
import { SendHorizontal, Smile } from "lucide-react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }
    }
  };

  const handleSendClick = () => {
    if (value.trim()) {
      onSend();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };

  return (
    <div className="border-t border-[#E5E7EB] bg-white px-4 py-3 shadow-xs">
      <div className="mx-auto flex max-w-4xl items-center gap-2.5">
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full rounded-full border border-[#E5E7EB] bg-[#F9FAFB] py-3 pl-4 pr-10 font-navbar text-sm text-[#1E1E1E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#FFA51F] focus:bg-white focus:ring-2 focus:ring-[#FFA51F]/20 sm:text-base"
            aria-label="Message"
          />
        </div>
        <button
          type="button"
          onClick={handleSendClick}
          disabled={!value.trim()}
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#FFA51F] text-[#1E1E1E] shadow-sm transition hover:bg-[#e8940f] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FFA51F]"
          aria-label="Send message"
        >
          <SendHorizontal className="size-5" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
