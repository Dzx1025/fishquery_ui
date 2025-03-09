// app/chats/page.tsx
import ChatList from "@/components/chat/ChatList";
import MessageList from "@/components/chat/MessageList";

export default function ChatsPage() {
  return (
    <div className="chats-page">
      <h2>Your Chats</h2>
      <ChatList />

      <div className="divider">----------</div>

      <h2>Chat Messages</h2>
      <MessageList chatId={"e94b8409-9982-4e1a-92e6-0eda66da5829"} />
    </div>
  );
}
