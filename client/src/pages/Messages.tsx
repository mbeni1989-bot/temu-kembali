import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Clock } from "lucide-react";

export default function Messages() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with real data from tRPC
  const conversations = [
    {
      id: "1",
      userName: "John Doe",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      lastMessage: "Terima kasih! Saya akan datang untuk mengambilnya besok.",
      timestamp: "2 menit yang lalu",
      unread: 2,
      reportTitle: "Dompet Hitam Nike",
    },
    {
      id: "2",
      userName: "Jane Smith",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      lastMessage: "Apakah masih tersedia?",
      timestamp: "1 jam yang lalu",
      unread: 0,
      reportTitle: "iPhone 13 Pro",
    },
    {
      id: "3",
      userName: "Ahmad Rizki",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      lastMessage: "Baik, saya tunggu kabar selanjutnya",
      timestamp: "3 jam yang lalu",
      unread: 1,
      reportTitle: "Kucing Persia Putih",
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.reportTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Pesan</h1>
          <p className="text-muted-foreground">Kelola percakapan Anda</p>
        </div>
      </div>

      <div className="container py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <Card
                key={conv.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                      src={conv.userAvatar}
                      alt={conv.userName}
                      className="w-12 h-12 rounded-full bg-muted"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{conv.userName}</h3>
                        <div className="flex items-center gap-2">
                          {conv.unread > 0 && (
                            <Badge className="bg-primary">{conv.unread}</Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {conv.timestamp}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 truncate">
                        {conv.reportTitle}
                      </p>
                      <p className="text-sm truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Belum ada percakapan</h3>
                <p className="text-muted-foreground">
                  Percakapan Anda akan muncul di sini setelah Anda melakukan klaim atau menerima klaim
                </p>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

