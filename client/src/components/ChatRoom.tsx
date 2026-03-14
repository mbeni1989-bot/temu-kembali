import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Phone, Info, MoreVertical, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Chat Room Component - WhatsApp Style with Two-Way Chat
 * Complete chat interface with typing indicators and real-time updates
 */

interface ChatRoomProps {
  conversationId: string;
  currentUserId: string;
  currentUserName: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  onBack?: () => void;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
}

interface TypingStatus {
  userId: string;
  isTyping: boolean;
  userName: string;
}

export default function ChatRoom({
  conversationId,
  currentUserId,
  currentUserName,
  otherUserId,
  otherUserName,
  otherUserAvatar,
  onBack,
}: ChatRoomProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Fetch messages from API with polling
  const { data: chatMessages, refetch: refetchMessages } = trpc.chats.getMessages.useQuery(
    { chatId: conversationId, limit: 100 },
    { 
      enabled: !!conversationId,
      refetchInterval: 1500, // Poll every 1.5 seconds for messages
    }
  );

  // Fetch typing status with polling
  const { data: typingStatusData } = trpc.chats.getTypingStatus.useQuery(
    { chatId: conversationId },
    { 
      enabled: !!conversationId,
      refetchInterval: 800, // Poll every 0.8 seconds for typing status
    }
  );

  // Send message mutation
  const sendMessageMutation = trpc.chats.sendMessage.useMutation({
    onSuccess: () => {
      setIsSending(false);
      setMessage("");
      void refetchMessages();
    },
    onError: (error) => {
      setIsSending(false);
      toast.error(error.message || "Gagal mengirim pesan");
    },
  });

  // Update typing status mutation
  const updateTypingMutation = trpc.chats.updateTypingStatus.useMutation();

  // Update messages when API data changes
  useEffect(() => {
    if (chatMessages && Array.isArray(chatMessages)) {
      const formattedMessages = chatMessages.map((msg: any) => ({
        id: msg.id,
        text: msg.content,
        senderId: msg.senderId,
        senderName: msg.senderName || (msg.senderId === currentUserId ? currentUserName : otherUserName),
        senderAvatar: msg.senderAvatar,
        timestamp: new Date(msg.createdAt),
      }));
      setMessages(formattedMessages);
      
      // Auto-scroll to bottom when new messages arrive
      if (isAutoScroll) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [chatMessages, currentUserId, currentUserName, otherUserName]);

  // Update typing status when data changes
  useEffect(() => {
    if (typingStatusData) {
      const otherUserStatus = typingStatusData.find((status: TypingStatus) => status.userId === otherUserId);
      setOtherUserTyping(otherUserStatus?.isTyping || false);
    }
  }, [typingStatusData, otherUserId]);

  // Handle scroll detection
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAutoScroll(isAtBottom);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Start typing indicator
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      updateTypingMutation.mutate({
        chatId: conversationId,
        userId: currentUserId,
        isTyping: true,
        userName: currentUserName,
      });
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (value.trim().length === 0) {
        setIsTyping(false);
        updateTypingMutation.mutate({
          chatId: conversationId,
          userId: currentUserId,
          isTyping: false,
          userName: currentUserName,
        });
      }
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim().length === 0 || isSending) {
      return;
    }

    setIsSending(true);

    // Send message via API
    sendMessageMutation.mutate({
      chatId: conversationId,
      content: message.trim(),
      messageType: "text",
    });

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      updateTypingMutation.mutate({
        chatId: conversationId,
        userId: currentUserId,
        isTyping: false,
        userName: currentUserName,
      });
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleInputBlur = () => {
    // Stop typing when input loses focus
    if (isTyping) {
      setIsTyping(false);
      updateTypingMutation.mutate({
        chatId: conversationId,
        userId: currentUserId,
        isTyping: false,
        userName: currentUserName,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Sticky at top with username always visible */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200 px-4 py-3 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              title="Kembali ke daftar chat"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-inner">
              {otherUserAvatar ? (
                <img src={otherUserAvatar} alt={otherUserName} className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials(otherUserName)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-foreground truncate">{otherUserName}</h2>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                {otherUserTyping ? (
                  <span className="text-primary font-medium animate-pulse">sedang mengetik...</span>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Aktif
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button 
              onClick={() => toast.info("Fitur panggilan suara akan segera hadir!")}
              className="p-2 hover:bg-accent/50 rounded-full transition-colors"
              title="Telepon"
            >
              <Phone className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={() => toast.info(`Informasi pengguna: ${otherUserName}`)}
              className="p-2 hover:bg-accent/50 rounded-full transition-colors"
              title="Informasi"
            >
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={() => toast.info("Menu lainnya")}
              className="p-2 hover:bg-accent/50 rounded-full transition-colors"
              title="Menu"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container - Flexible scrolling */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-gradient-to-b from-blue-50/30 to-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">{getInitials(otherUserName)}</span>
              </div>
              <p className="text-gray-600 font-medium">Mulai percakapan dengan {otherUserName}</p>
              <p className="text-sm text-gray-500 mt-1">Pesan Anda akan terenkripsi end-to-end</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              // Ensure both IDs are compared as strings to avoid type mismatch
              const isSender = String(msg.senderId) === String(currentUserId);
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSender ? "justify-end" : "justify-start"} animate-fadeIn gap-2`}
                >
                  {/* Avatar for received messages */}
                  {!isSender && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.senderAvatar ? (
                        <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(msg.senderName)
                      )}
                    </div>
                  )}

                  <div className={`max-w-[70%] ${isSender ? "" : "flex flex-col"}`}>
                    {/* Sender name for received messages */}
                    {!isSender && (
                      <p className="text-xs text-gray-600 font-semibold mb-1 px-2">{msg.senderName}</p>
                    )}
                    
                    <div
                      className={`rounded-2xl px-4 py-2 break-words shadow-sm ${
                        isSender
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isSender ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Avatar for sent messages */}
                  {isSender && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {getInitials(currentUserName)}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {otherUserTyping && (
              <div className="flex justify-start animate-fadeIn gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getInitials(otherUserName)}
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - WhatsApp Style */}
      <div className="bg-white border-t border-gray-200 p-3 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Ketik pesan..."
            className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={message.trim().length === 0 || isSending}
            className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
