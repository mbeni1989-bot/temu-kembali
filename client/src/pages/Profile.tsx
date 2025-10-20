import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  FileText,
  LogOut,
  Settings,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Profile() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Silakan Login</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Anda harus login untuk melihat profil
            </p>
            <Button onClick={() => setLocation("/login")}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{user.name || "Pengguna"}</h1>
              <div className="flex items-center gap-2 mt-1">
                {user.isVerified ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Terverifikasi
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                    <XCircle className="w-3 h-3 mr-1" />
                    Belum Terverifikasi
                  </Badge>
                )}
                {user.role === "admin" && (
                  <Badge className="bg-purple-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            )}

            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {user.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Lokasi</p>
                  <p className="font-medium">{user.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Reputasi</p>
                <p className="font-medium">{user.reputationScore || 0} poin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        {!user.isVerified && (
          <Card className="border-orange-500 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-orange-500 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Verifikasi Akun Anda</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Verifikasi akun Anda untuk meningkatkan kepercayaan dan mengakses semua fitur
                  </p>
                  <Button
                    onClick={() => setLocation("/verify-account")}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Verifikasi Sekarang
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Tabs */}
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Laporan Saya</TabsTrigger>
            <TabsTrigger value="claims">Klaim Saya</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Saya</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Belum ada laporan. Buat laporan pertama Anda!
                </p>
                <Button onClick={() => setLocation("/create")} className="w-full">
                  Buat Laporan Baru
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="claims" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Klaim Saya</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Belum ada klaim. Klaim laporan yang sesuai!
                </p>
                <Button onClick={() => setLocation("/explore")} className="w-full">
                  Jelajahi Laporan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setLocation("/settings")}
            >
              <Settings className="w-5 h-5 mr-3" />
              Pengaturan
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

