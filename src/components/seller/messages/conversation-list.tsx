import type { Conversation } from "@/components/seller/messages/messages-dummy-data";
import { ConversationItem } from "@/components/seller/messages/conversation-item";
import { cn } from "@/lib/utils";

type ConversationListProps = {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
};

export function ConversationList({ conversations, activeId, onSelect, className }: ConversationListProps) {
  const count = conversations.length;
  const subtitle = `${count} conversation${count === 1 ? "" : "s"}`;

  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col border-[#E5E7EB] bg-white lg:w-80 lg:border-r",
        className
      )}
    >
      <div className="px-4 pb-4 pt-5 lg:pt-6">
        <h1 className="font-hero-heading text-xl font-bold text-[#1E1E1E] sm:text-2xl">Messages</h1>
        <p className="mt-1 font-navbar text-sm text-[#5E5E5E]">{subtitle}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto border-t border-[#E5E7EB] lg:border-t-0">
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            conversation={c}
            isSelected={c.id === activeId}
            onSelect={() => onSelect(c.id)}
          />
        ))}
      </div>
    </aside>
  );
}
