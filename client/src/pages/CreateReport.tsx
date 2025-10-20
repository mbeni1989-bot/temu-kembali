import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { 
  Package, 
  PawPrint, 
  Car, 
  UserSearch, 
  MapPin, 
  Calendar,
  Upload,
  Info,
  AlertCircle
} from "lucide-react";

type ReportType = "lost_item" | "found_item" | "lost_person" | "find_person";
type Category = "barang" | "hewan" | "kendaraan" | "orang";

export default function CreateReport() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [reportType, setReportType] = useState<ReportType>("lost_item");
  const [category, setCategory] = useState<Category>("barang");
  
  // Common fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  
  // Item fields
  const [itemBrand, setItemBrand] = useState("");
  const [itemColor, setItemColor] = useState("");
  const [itemModel, setItemModel] = useState("");
  
  // Animal fields
  const [animalType, setAnimalType] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [animalName, setAnimalName] = useState("");
  
  // Vehicle fields
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  
  // Person fields
  const [personName, setPersonName] = useState("");
  const [personNickname, setPersonNickname] = useState("");
  const [personAge, setPersonAge] = useState("");
  const [personGender, setPersonGender] = useState<"male" | "female">("male");
  const [personHeight, setPersonHeight] = useState("");
  const [personWeight, setPersonWeight] = useState("");
  const [personPhysicalFeatures, setPersonPhysicalFeatures] = useState("");
  const [personLastWearing, setPersonLastWearing] = useState("");
  const [personRelationship, setPersonRelationship] = useState("");
  const [personLastKnownInfo, setPersonLastKnownInfo] = useState("");
  const [policeReportNumber, setPoliceReportNumber] = useState("");
  
  // Reward
  const [hasReward, setHasReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("");

  const createReportMutation = trpc.reports.create.useMutation({
    onSuccess: (data) => {
      toast.success("Laporan berhasil dibuat!");
      setLocation(`/report/${data.reportId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat laporan");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    const baseData = {
      type: reportType,
      category,
      title,
      description,
      locationName: locationName || undefined,
      city: city || undefined,
      province: province || undefined,
      incidentDate: incidentDate ? new Date(incidentDate) : undefined,
      hasReward,
      rewardAmount: hasReward && rewardAmount ? parseFloat(rewardAmount) : undefined,
    };

    let specificData = {};

    if (category === "barang") {
      specificData = {
        itemBrand: itemBrand || undefined,
        itemColor: itemColor || undefined,
        itemModel: itemModel || undefined,
      };
    } else if (category === "hewan") {
      specificData = {
        animalType: animalType || undefined,
        animalBreed: animalBreed || undefined,
        animalName: animalName || undefined,
      };
    } else if (category === "kendaraan") {
      specificData = {
        vehicleType: vehicleType || undefined,
        vehiclePlate: vehiclePlate || undefined,
      };
    } else if (category === "orang") {
      specificData = {
        personName: personName || undefined,
        personNickname: personNickname || undefined,
        personAge: personAge ? parseInt(personAge) : undefined,
        personGender: personGender || undefined,
        personHeight: personHeight ? parseFloat(personHeight) : undefined,
        personWeight: personWeight ? parseFloat(personWeight) : undefined,
        personPhysicalFeatures: personPhysicalFeatures || undefined,
        personLastWearing: personLastWearing || undefined,
        personRelationship: personRelationship || undefined,
        personLastKnownInfo: personLastKnownInfo || undefined,
        policeReportNumber: policeReportNumber || undefined,
      };
    }

    createReportMutation.mutate({
      ...baseData,
      ...specificData,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <CardTitle>Login Diperlukan</CardTitle>
            <CardDescription>
              Anda harus login terlebih dahulu untuk membuat laporan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">Login Sekarang</Button>
            </a>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Buat Laporan</h1>
          <p className="text-muted-foreground">Laporkan kehilangan atau penemuan untuk membantu sesama</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          {/* Report Type Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Jenis Laporan</CardTitle>
              <CardDescription>Pilih jenis laporan yang ingin Anda buat</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
                  <TabsTrigger value="lost_item" className="py-3">
                    <Package className="w-4 h-4 mr-2" />
                    Kehilangan
                  </TabsTrigger>
                  <TabsTrigger value="found_item" className="py-3">
                    <Package className="w-4 h-4 mr-2" />
                    Penemuan
                  </TabsTrigger>
                  <TabsTrigger value="lost_person" className="py-3">
                    <UserSearch className="w-4 h-4 mr-2" />
                    Orang Hilang
                  </TabsTrigger>
                  <TabsTrigger value="find_person" className="py-3">
                    <UserSearch className="w-4 h-4 mr-2" />
                    Cari Teman
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Kategori</CardTitle>
              <CardDescription>Pilih kategori yang sesuai</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {(reportType === "lost_item" || reportType === "found_item") && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCategory("barang")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        category === "barang"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="font-semibold">Barang</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory("hewan")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        category === "hewan"
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <PawPrint className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <p className="font-semibold">Hewan</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory("kendaraan")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        category === "kendaraan"
                          ? "border-secondary bg-secondary/10"
                          : "border-border hover:border-secondary/50"
                      }`}
                    >
                      <Car className="w-8 h-8 mx-auto mb-2 text-secondary" />
                      <p className="font-semibold">Kendaraan</p>
                    </button>
                  </>
                )}
                {(reportType === "lost_person" || reportType === "find_person") && (
                  <button
                    type="button"
                    onClick={() => setCategory("orang")}
                    className="p-4 rounded-xl border-2 border-primary bg-primary/10"
                  >
                    <UserSearch className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Orang</p>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Laporan *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Hilang Dompet Kulit Coklat di Mall"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi Detail *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan secara detail..."
                  rows={5}
                  required
                  className="mt-1.5"
                />
                <Alert className="mt-2">
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    Gunakan bahasa yang lengkap dan hindari singkatan untuk membantu sistem pencocokan otomatis bekerja lebih akurat
                  </AlertDescription>
                </Alert>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="locationName">Lokasi Kejadian</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="locationName"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="Contoh: Mall Grand Indonesia"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="incidentDate">Tanggal Kejadian</Label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="incidentDate"
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Jakarta"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="province">Provinsi</Label>
                  <Input
                    id="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Contoh: DKI Jakarta"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Specific Fields */}
          {category === "barang" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detail Barang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="itemBrand">Merek</Label>
                    <Input
                      id="itemBrand"
                      value={itemBrand}
                      onChange={(e) => setItemBrand(e.target.value)}
                      placeholder="Contoh: Samsung"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemColor">Warna</Label>
                    <Input
                      id="itemColor"
                      value={itemColor}
                      onChange={(e) => setItemColor(e.target.value)}
                      placeholder="Contoh: Hitam"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemModel">Model/Tipe</Label>
                    <Input
                      id="itemModel"
                      value={itemModel}
                      onChange={(e) => setItemModel(e.target.value)}
                      placeholder="Contoh: Galaxy S23"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {category === "hewan" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detail Hewan Peliharaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="animalType">Jenis Hewan</Label>
                    <Input
                      id="animalType"
                      value={animalType}
                      onChange={(e) => setAnimalType(e.target.value)}
                      placeholder="Contoh: Kucing"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="animalBreed">Ras</Label>
                    <Input
                      id="animalBreed"
                      value={animalBreed}
                      onChange={(e) => setAnimalBreed(e.target.value)}
                      placeholder="Contoh: Persian"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="animalName">Nama Hewan</Label>
                    <Input
                      id="animalName"
                      value={animalName}
                      onChange={(e) => setAnimalName(e.target.value)}
                      placeholder="Contoh: Momo"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {category === "kendaraan" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detail Kendaraan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleType">Jenis Kendaraan</Label>
                    <Input
                      id="vehicleType"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      placeholder="Contoh: Motor Honda Beat"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehiclePlate">Nomor Polisi</Label>
                    <Input
                      id="vehiclePlate"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      placeholder="Contoh: B 1234 XYZ"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {category === "orang" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detail Orang</CardTitle>
                <CardDescription>
                  {reportType === "find_person" 
                    ? "Informasi orang yang ingin Anda temukan kembali (reunian)"
                    : "Informasi orang yang hilang"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personName">Nama Lengkap *</Label>
                    <Input
                      id="personName"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder="Nama lengkap"
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personNickname">Nama Panggilan</Label>
                    <Input
                      id="personNickname"
                      value={personNickname}
                      onChange={(e) => setPersonNickname(e.target.value)}
                      placeholder="Nama panggilan atau alias"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="personAge">Usia</Label>
                    <Input
                      id="personAge"
                      type="number"
                      value={personAge}
                      onChange={(e) => setPersonAge(e.target.value)}
                      placeholder="Tahun"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personGender">Jenis Kelamin</Label>
                    <Select value={personGender} onValueChange={(value: any) => setPersonGender(value)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="personHeight">Tinggi (cm)</Label>
                    <Input
                      id="personHeight"
                      type="number"
                      value={personHeight}
                      onChange={(e) => setPersonHeight(e.target.value)}
                      placeholder="cm"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personWeight">Berat (kg)</Label>
                    <Input
                      id="personWeight"
                      type="number"
                      value={personWeight}
                      onChange={(e) => setPersonWeight(e.target.value)}
                      placeholder="kg"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="personPhysicalFeatures">Ciri-ciri Fisik</Label>
                  <Textarea
                    id="personPhysicalFeatures"
                    value={personPhysicalFeatures}
                    onChange={(e) => setPersonPhysicalFeatures(e.target.value)}
                    placeholder="Contoh: Rambut pendek hitam, mata coklat, tahi lalat di pipi kanan..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {reportType === "lost_person" && (
                  <>
                    <div>
                      <Label htmlFor="personLastWearing">Pakaian Terakhir yang Dikenakan</Label>
                      <Textarea
                        id="personLastWearing"
                        value={personLastWearing}
                        onChange={(e) => setPersonLastWearing(e.target.value)}
                        placeholder="Contoh: Kaos putih, celana jeans biru, sepatu hitam..."
                        rows={2}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="policeReportNumber">Nomor Laporan Polisi</Label>
                      <Input
                        id="policeReportNumber"
                        value={policeReportNumber}
                        onChange={(e) => setPoliceReportNumber(e.target.value)}
                        placeholder="Jika sudah melapor ke polisi"
                        className="mt-1.5"
                      />
                    </div>
                  </>
                )}

                {reportType === "find_person" && (
                  <>
                    <div>
                      <Label htmlFor="personRelationship">Hubungan dengan Anda</Label>
                      <Input
                        id="personRelationship"
                        value={personRelationship}
                        onChange={(e) => setPersonRelationship(e.target.value)}
                        placeholder="Contoh: Teman SD, Saudara jauh, Tetangga lama..."
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personLastKnownInfo">Informasi Terakhir yang Diketahui</Label>
                      <Textarea
                        id="personLastKnownInfo"
                        value={personLastKnownInfo}
                        onChange={(e) => setPersonLastKnownInfo(e.target.value)}
                        placeholder="Contoh: Terakhir tinggal di Jakarta tahun 2010, bekerja sebagai guru..."
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reward */}
          {(reportType === "lost_item" || reportType === "lost_person") && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Hadiah (Opsional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasReward"
                    checked={hasReward}
                    onCheckedChange={(checked) => setHasReward(checked as boolean)}
                  />
                  <Label htmlFor="hasReward" className="cursor-pointer">
                    Saya ingin memberikan hadiah untuk yang menemukan
                  </Label>
                </div>

                {hasReward && (
                  <div>
                    <Label htmlFor="rewardAmount">Jumlah Hadiah (Rp)</Label>
                    <Input
                      id="rewardAmount"
                      type="number"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      placeholder="Contoh: 500000"
                      className="mt-1.5"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/explore")}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createReportMutation.isPending}
              className="flex-1"
            >
              {createReportMutation.isPending ? "Menyimpan..." : "Buat Laporan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

