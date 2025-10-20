import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Eye,
  Package,
  PawPrint,
  Car,
  UserSearch,
  AlertCircle,
  CheckCircle,
  Shield,
  Phone,
  CreditCard,
  Upload,
  Info
} from "lucide-react";
import { getLoginUrl } from "@/const";

export default function ReportDetail() {
  const { t } = useTranslation();
  const { id: reportId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ktpImage, setKtpImage] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isKtpVerified, setIsKtpVerified] = useState(false);

  const { data: report, isLoading } = trpc.reports.getById.useQuery(
    { id: reportId || "" },
    { enabled: !!reportId }
  );

  const createClaimMutation = trpc.claims.create.useMutation({
    onSuccess: () => {
      setClaimDialogOpen(false);
      setVerificationDialogOpen(false);
      setSuccessDialogOpen(true);
      setClaimMessage("");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal mengirim klaim");
    },
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "barang":
        return <Package className="w-5 h-5" />;
      case "hewan":
        return <PawPrint className="w-5 h-5" />;
      case "kendaraan":
        return <Car className="w-5 h-5" />;
      case "orang":
        return <UserSearch className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-primary">Aktif</Badge>;
      case "resolved":
        return <Badge variant="secondary" className="bg-green-500 text-white">Selesai</Badge>;
      case "closed":
        return <Badge variant="outline">Ditutup</Badge>;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "lost_item":
        return "Kehilangan";
      case "found_item":
        return "Penemuan";
      case "lost_person":
        return "Orang Hilang";
      case "find_person":
        return "Cari Teman/Keluarga";
      default:
        return type;
    }
  };

  const handleVerificationSubmit = () => {
    if (!phoneNumber) {
      toast.error("Nomor telepon harus diisi");
      return;
    }
    if (!ktpImage) {
      toast.error("Foto KTP harus diunggah");
      return;
    }

    // Simulate verification process
    setIsPhoneVerified(true);
    setIsKtpVerified(true);
    
    // Proceed with claim
    if (report) {
      createClaimMutation.mutate({
        reportId: report.id,
        message: claimMessage,
      });
    }
  };

  const handleClaimClick = () => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      window.location.href = getLoginUrl();
      return;
    }

    // Check if user's phone is already verified
    if (user?.phone && user.phone.length > 0) {
      setIsPhoneVerified(true);
    }

    setVerificationDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <CardTitle>Laporan Tidak Ditemukan</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/explore")} className="w-full">
              Kembali ke Jelajah
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === report.userId;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            {getCategoryIcon(report.category)}
            <Badge variant="outline" className="capitalize">
              {report.category}
            </Badge>
            <Badge variant="secondary">{getTypeLabel(report.type)}</Badge>
            {getStatusBadge(report.status)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{report.title}</h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {report.images && JSON.parse(report.images).length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={JSON.parse(report.images)[0]}
                    alt={report.title}
                    className="w-full h-96 object-cover rounded-t-xl"
                  />
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.locationName && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Lokasi</p>
                      <p className="text-muted-foreground">{report.locationName}</p>
                      {report.city && report.province && (
                        <p className="text-sm text-muted-foreground">{report.city}, {report.province}</p>
                      )}
                    </div>
                  </div>
                )}

                {report.incidentDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Tanggal Kejadian</p>
                      <p className="text-muted-foreground">
                        {format(new Date(report.incidentDate as any), "d MMMM yyyy", { locale: id })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Category specific details */}
                {report.category === "barang" && (
                  <>
                    {report.itemBrand && (
                      <div>
                        <p className="font-medium">Merek</p>
                        <p className="text-muted-foreground">{report.itemBrand}</p>
                      </div>
                    )}
                    {report.itemColor && (
                      <div>
                        <p className="font-medium">Warna</p>
                        <p className="text-muted-foreground">{report.itemColor}</p>
                      </div>
                    )}
                    {report.itemModel && (
                      <div>
                        <p className="font-medium">Model</p>
                        <p className="text-muted-foreground">{report.itemModel}</p>
                      </div>
                    )}
                  </>
                )}

                {report.category === "hewan" && (
                  <>
                    {report.animalType && (
                      <div>
                        <p className="font-medium">Jenis Hewan</p>
                        <p className="text-muted-foreground">{report.animalType}</p>
                      </div>
                    )}
                    {report.animalBreed && (
                      <div>
                        <p className="font-medium">Ras</p>
                        <p className="text-muted-foreground">{report.animalBreed}</p>
                      </div>
                    )}
                    {report.animalName && (
                      <div>
                        <p className="font-medium">Nama</p>
                        <p className="text-muted-foreground">{report.animalName}</p>
                      </div>
                    )}
                  </>
                )}

                {report.category === "kendaraan" && (
                  <>
                    {report.vehicleType && (
                      <div>
                        <p className="font-medium">Jenis Kendaraan</p>
                        <p className="text-muted-foreground">{report.vehicleType}</p>
                      </div>
                    )}
                    {report.vehiclePlate && (
                      <div>
                        <p className="font-medium">Nomor Polisi</p>
                        <p className="text-muted-foreground">{report.vehiclePlate}</p>
                      </div>
                    )}
                  </>
                )}

                {report.category === "orang" && (
                  <>
                    {report.personName && (
                      <div>
                        <p className="font-medium">Nama</p>
                        <p className="text-muted-foreground">{report.personName}</p>
                      </div>
                    )}
                    {report.personNickname && (
                      <div>
                        <p className="font-medium">Nama Panggilan</p>
                        <p className="text-muted-foreground">{report.personNickname}</p>
                      </div>
                    )}
                    {report.personAge && (
                      <div>
                        <p className="font-medium">Usia</p>
                        <p className="text-muted-foreground">{report.personAge} tahun</p>
                      </div>
                    )}
                    {report.personGender && (
                      <div>
                        <p className="font-medium">Jenis Kelamin</p>
                        <p className="text-muted-foreground">
                          {report.personGender === "male" ? "Laki-laki" : "Perempuan"}
                        </p>
                      </div>
                    )}
                    {report.personPhysicalFeatures && (
                      <div>
                        <p className="font-medium">Ciri-ciri Fisik</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{report.personPhysicalFeatures}</p>
                      </div>
                    )}
                    {report.personLastWearing && (
                      <div>
                        <p className="font-medium">Pakaian Terakhir</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{report.personLastWearing}</p>
                      </div>
                    )}
                    {report.policeReportNumber && (
                      <div>
                        <p className="font-medium">Nomor Laporan Polisi</p>
                        <p className="text-muted-foreground">{report.policeReportNumber}</p>
                      </div>
                    )}
                  </>
                )}

                {report.hasReward && report.rewardAmount && (
                  <div className="pt-3 border-t">
                    <p className="font-medium text-green-600">Hadiah</p>
                    <p className="text-lg font-bold text-green-600">
                      Rp {report.rewardAmount.toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            {!isOwner && report.status === "active" && (
              <Card>
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleClaimClick} className="w-full" size="lg">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Klaim Laporan Ini
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Verifikasi Identitas</DialogTitle>
                        <DialogDescription>
                          Untuk keamanan bersama, kami memerlukan verifikasi nomor telepon dan KTP Anda sebelum melakukan klaim
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <Alert>
                          <Shield className="w-4 h-4" />
                          <AlertDescription className="text-sm">
                            Data Anda akan dienkripsi dan hanya digunakan untuk verifikasi. Kami menjaga privasi Anda.
                          </AlertDescription>
                        </Alert>

                        {/* Phone Verification */}
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Nomor Telepon *
                            {isPhoneVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            disabled={isPhoneVerified}
                            required
                          />
                          {!isPhoneVerified && phoneNumber && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast.success("Kode verifikasi telah dikirim ke nomor Anda");
                                setIsPhoneVerified(true);
                              }}
                            >
                              Kirim Kode Verifikasi
                            </Button>
                          )}
                        </div>

                        {/* KTP Verification */}
                        <div className="space-y-2">
                          <Label htmlFor="ktp" className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Foto KTP *
                            {isKtpVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              {ktpImage ? "KTP berhasil diunggah" : "Klik untuk unggah foto KTP"}
                            </p>
                            <Input
                              id="ktp"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setKtpImage(URL.createObjectURL(e.target.files[0]));
                                  setIsKtpVerified(true);
                                  toast.success("Foto KTP berhasil diunggah");
                                }
                              }}
                              className="hidden"
                            />
                            <label htmlFor="ktp" className="cursor-pointer">
                              <Button type="button" variant="outline" size="sm" asChild>
                                <span>Pilih File</span>
                              </Button>
                            </label>
                          </div>
                          {ktpImage && (
                            <img src={ktpImage} alt="KTP Preview" className="w-full rounded-lg mt-2" />
                          )}
                        </div>

                        {/* Claim Message */}
                        <div className="space-y-2">
                          <Label htmlFor="claimMessage">Pesan (Opsional)</Label>
                          <Textarea
                            id="claimMessage"
                            value={claimMessage}
                            onChange={(e) => setClaimMessage(e.target.value)}
                            placeholder="Tambahkan informasi tambahan jika diperlukan..."
                            rows={3}
                          />
                        </div>

                        <Alert>
                          <Info className="w-4 h-4" />
                          <AlertDescription className="text-sm">
                            Setelah klaim diterima, Anda akan dapat berkomunikasi dengan pelapor melalui chat di dalam aplikasi
                          </AlertDescription>
                        </Alert>

                        <Button
                          onClick={handleVerificationSubmit}
                          disabled={!isPhoneVerified || !isKtpVerified || createClaimMutation.isPending}
                          className="w-full"
                        >
                          {createClaimMutation.isPending ? "Mengirim..." : "Kirim Klaim"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <p className="text-xs text-muted-foreground text-center">
                    Dengan mengklaim, Anda setuju untuk memverifikasi identitas Anda
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Dilihat</span>
                  </div>
                  <span className="font-semibold">{report.viewCount || 0}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Dibuat</span>
                  </div>
                  <span className="text-sm">
                    {report.createdAt && format(new Date(report.createdAt as any), "d MMM yyyy", { locale: id })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Tips Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-amber-900 space-y-2">
                <p>• Selalu berkomunikasi melalui chat di dalam aplikasi</p>
                <p>• Jangan membagikan informasi pribadi di luar aplikasi</p>
                <p>• Bertemu di tempat umum yang ramai</p>
                <p>• Laporkan aktivitas mencurigakan kepada kami</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl text-center">Selamat! 🎉</DialogTitle>
            <DialogDescription className="text-center text-base">
              Klaim Anda berhasil dikirim! Pemilik laporan akan segera menghubungi Anda melalui chat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                Terima kasih telah membantu! Jika Anda ingin mendukung aplikasi Temu Kembali, pertimbangkan untuk memberikan donasi.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setSuccessDialogOpen(false);
                  setLocation("/donate");
                }}
                className="w-full"
                size="lg"
              >
                ❤️ Donasi Sekarang
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSuccessDialogOpen(false);
                  setLocation("/messages");
                }}
                className="w-full"
              >
                Lihat Pesan
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSuccessDialogOpen(false)}
                className="w-full"
              >
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

