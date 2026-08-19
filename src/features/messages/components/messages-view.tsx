import { ConversationList } from "./conversation-list";
import { MessageThread } from "./message-thread";
import { MessageInput } from "./message-input";

export function MessagesView() {
  return (
    <>
      <ConversationList />
      <MessageThread />
      <MessageInput />
    </>
  );
}
