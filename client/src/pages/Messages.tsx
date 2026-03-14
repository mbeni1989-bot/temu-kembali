import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  MessageCircle, 
  ShieldAlert, 
  Users, 
  MapPin, 
  Phone, 
  AlertTriangle,
  Loader2,
  ChevronRight,
  User,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChatRoom from "@/components/ChatRoom";
import { useLocation } from "wouter";

export default function Messages() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location] = useLocation();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Parse chatId from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get("chatId");
    if (chatId) {
      setSelectedChatId(chatId);
    }
  }, [location]);

  const { data: chats, isLoading } = trpc.chats.getMyChats.useQuery(undefined, {
    enabled: !!user,
  });

  const selectedChat = chats?.find((c: any) => String(c.id) === String(selectedChatId));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-background flex flex-col overflow-hidden">
      {/* Header - Hidden on mobile when chat is selected */}
      <div className={`bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b shrink-0 ${selectedChatId ? 'hidden md:block' : 'block'}`}>
        <div className="container py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Pesan</h1>
          <p className="text-sm text-muted-foreground">Kelola percakapan Anda</p>
        </div>
      </div>

      <div className="container flex-1 overflow-hidden py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Chat List */}
          <div className={`md:col-span-1 flex flex-col h-full ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
            <h2 className="text-xl font-semibold mb-4">Percakapan</h2>
            {!chats || chats.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">Belum ada percakapan</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {chats.map((chat: any) => {
                  const otherUser = chat.user1Id === user?.id ? chat.user2 : chat.user1;
                  const isOwner = chat.report?.userId === user?.id;
                  const reportType = chat.report?.type;
                  
                  // Determine role label and color
                  let roleLabel = "";
                  let roleColor = "";
                  
                  if (reportType === "lost_item" || reportType === "lost_person") {
                    roleLabel = isOwner ? "Pemilik (Mencari)" : "Penemu (Membantu)";
                    roleColor = isOwner ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200";
                  } else if (reportType === "found_item") {
                    roleLabel = isOwner ? "Penemu (Melaporkan)" : "Pemilik (Mengklaim)";
                    roleColor = isOwner ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200";
                  } else {
                    roleLabel = "Diskusi";
                    roleColor = "bg-gray-100 text-gray-700 border-gray-200";
                  }

                  return (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                        selectedChatId === chat.id
                          ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/20"
                          : "bg-card hover:bg-accent/30 border-border hover:border-primary/30"
                      }`}
                    >
                      {chat.unreadCount > 0 && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-bl-lg" />
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedChatId === chat.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            {otherUser?.avatar ? (
                              <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="w-6 h-6" />
                            )}
                          </div>
                          {chat.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className={`font-bold truncate ${chat.unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'}`}>
                              {otherUser?.name || "Pengguna"}
                            </p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                              {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 leading-none h-4 font-medium ${roleColor}`}>
                              {roleLabel}
                            </Badge>
                            {chat.report?.title && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 leading-none h-4 font-normal truncate max-w-[120px]">
                                {chat.report.title}
                              </Badge>
                            )}
                          </div>
                          
                          <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                            {chat.lastMessage?.senderId === user?.id ? 'Anda: ' : ''}
                            {chat.lastMessage?.content || "Belum ada pesan"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat Room or Empty State */}
          <div className={`md:col-span-2 h-full ${selectedChatId ? 'block' : 'hidden md:block'}`}>
            {selectedChat && user ? (
              <div className="h-full flex flex-col">
                <div className="md:hidden mb-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedChatId(null)}>
                    ← Kembali ke Daftar
                  </Button>
                </div>
                <div className="flex-1 min-h-0">
                  <ChatRoom
                    conversationId={selectedChat.id}
                    currentUserId={user.id}
                    currentUserName={user.name || "Saya"}
                    otherUserId={String(selectedChat.user1Id) === String(user.id) ? selectedChat.user2Id : selectedChat.user1Id}
                    otherUserName={String(selectedChat.user1Id) === String(user.id) ? (selectedChat.user2?.name || "Pengguna") : (selectedChat.user1?.name || "Pengguna")}
                    otherUserAvatar={String(selectedChat.user1Id) === String(user.id) ? selectedChat.user2?.avatar : selectedChat.user1?.avatar}
                    onBack={() => setSelectedChatId(null)}
                  />
                </div>
              </div>
            ) : !chats || chats.length === 0 ? (
              <div className="space-y-6">
                {/* Original Empty State & Safety Reminders */}
                <Card>
                  <CardHeader className="text-center py-12">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Pesan Akan Tampil Disini</h3>
                    <p className="text-muted-foreground">
                      Pilih percakapan di sebelah kiri untuk mulai mengobrol.
                    </p>
                  </CardHeader>
                </Card>

                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert className="w-6 h-6 text-orange-600" />
                      <h3 className="text-lg font-semibold text-orange-900">Himbauan Keamanan Saat Bertemu</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-orange-900">Bertemu di Tempat Umum</p>
                          <p className="text-sm text-orange-800">
                            Pilih lokasi ramai seperti mall, cafe, atau kantor polisi untuk bertemu. Hindari tempat sepi atau terpencil.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-orange-900">Ajak Teman atau Keluarga</p>
                          <p className="text-sm text-orange-800">
                            Jangan pergi sendirian. Beri tahu teman atau keluarga tentang pertemuan Anda, termasuk lokasi dan waktu.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-orange-900">Verifikasi Identitas</p>
                          <p className="text-sm text-orange-800">
                            Minta bukti kepemilikan atau detail barang sebelum bertemu. Pastikan orang tersebut adalah pemilik/penemu yang sah.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-orange-900">Waspadai Penipuan</p>
                          <p className="text-sm text-orange-800">
                            Jangan transfer uang sebelum bertemu. Hati-hati dengan permintaan yang mencurigakan atau terburu-buru.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-orange-900 font-medium mb-1">
                        ⚠️ Penting untuk Diingat:
                      </p>
                      <ul className="text-sm text-orange-800 space-y-1 ml-4 list-disc">
                        <li>Percayai insting Anda. Jika merasa tidak aman, batalkan pertemuan.</li>
                        <li>Jangan berikan informasi pribadi sensitif (alamat rumah, nomor rekening).</li>
                        <li>Laporkan aktivitas mencurigakan kepada pihak berwenang.</li>
                        <li>Gunakan fitur chat dalam aplikasi untuk komunikasi awal.</li>
                      </ul>
                    </div>                  </CardContent>
                </Card>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground">Pilih percakapan di sebelah kiri untuk mulai mengobrol.</p>
              </div>
            )}          </div>
        </div>
      </div>
    </div>
  );
}
