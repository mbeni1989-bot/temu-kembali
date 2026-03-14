import { useState, useRef } from "react";
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
  Camera,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { RoleBadge } from "@/components/RoleBadge";

export default function Profile() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Fetch user reports
  const { data: myReports, isLoading: reportsLoading } = trpc.reports.getMyReports.useQuery();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Foto profil berhasil diperbarui!");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui foto profil");
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarPreview(base64);
        
        // Save to database
        updateProfileMutation.mutate({
          avatar: base64
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b overflow-hidden">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
            <div className="relative group shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl">
                {avatarPreview || user.avatar ? (
                  <img src={avatarPreview || user.avatar || ""} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-24 h-24 text-primary" />
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                disabled={updateProfileMutation.isPending}
                className="absolute bottom-4 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 border-4 border-white disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center md:text-left pb-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">{user.name || "Pengguna"}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 overflow-x-auto">
                <RoleBadge role={user.role || 'user'} size="lg" />
                {user.isVerified ? (
                  <Badge className="bg-green-500 text-sm py-1 px-3">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Terverifikasi
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-500 text-orange-500 text-sm py-1 px-3 bg-orange-50/50">
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Belum Terverifikasi
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
                <CardTitle>Laporan Saya ({myReports?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <p className="text-muted-foreground text-center py-8">Memuat laporan...</p>
                ) : myReports && myReports.length > 0 ? (
                  <div className="space-y-4">
                    {myReports.map((report: any) => (
                      <div
                        key={report.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => setLocation(`/report/${report.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{report.title}</h3>
                          <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                            {report.status === 'active' ? 'Aktif' : report.status === 'resolved' ? 'Selesai' : 'Ditutup'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{report.category}</span>
                          <span>•</span>
                          <span>{report.city || 'Lokasi tidak diketahui'}</span>
                          <span>•</span>
                          <span>{new Date(report.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Belum ada laporan. Buat laporan pertama Anda!
                    </p>
                    <Button onClick={() => setLocation("/create")}>
                      Buat Laporan Baru
                    </Button>
                  </div>
                )}
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

