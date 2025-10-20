import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
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
  Info,
  AlertCircle,
  Globe,
  Navigation,
  Map as MapIcon
} from "lucide-react";
import { lazy, Suspense } from "react";

const InteractiveMap = lazy(() => import("@/components/InteractiveMap"));

type ReportType = "lost_item" | "found_item" | "lost_person" | "find_person";
type Category = "barang" | "hewan" | "kendaraan" | "orang";

export default function CreateReport() {
  const { t, i18n } = useTranslation();
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
  const [country, setCountry] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]); // Default: Jakarta
  const [showMap, setShowMap] = useState(false);
  
  // Location suggestions
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
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

  // Detect user timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Auto-detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Set coordinates and map center
            setLocationLat(lat);
            setLocationLng(lng);
            setMapCenter([lat, lng]);
            
            // Use reverse geocoding to get location details
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            
            if (data.address) {
              setCity(data.address.city || data.address.town || data.address.village || "");
              setProvince(data.address.state || "");
              setCountry(data.address.country || "");
            }
          } catch (error) {
            console.error("Error getting location:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Function to get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.info("Getting your location...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            setLocationLat(lat);
            setLocationLng(lng);
            setMapCenter([lat, lng]);
            setShowMap(true);
            
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            
            if (data.address) {
              setLocationName(data.display_name || "");
              setCity(data.address.city || data.address.town || data.address.village || "");
              setProvince(data.address.state || "");
              setCountry(data.address.country || "");
              toast.success("Location detected successfully!");
            }
          } catch (error) {
            console.error("Error getting location:", error);
            toast.error("Failed to get location details");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Failed to access your location. Please enable location services.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Handle map location change
  const handleMapLocationChange = (lat: number, lng: number, address: string) => {
    setLocationLat(lat);
    setLocationLng(lng);
    setLocationName(address);
    
    // Parse address to extract city, province, country
    const parts = address.split(", ");
    if (parts.length >= 2) {
      setCity(parts[0]);
      if (parts.length >= 3) {
        setProvince(parts[parts.length - 2]);
      }
      setCountry(parts[parts.length - 1]);
    }
  };

  // Location autocomplete
  const handleLocationInput = async (value: string) => {
    setLocationName(value);
    
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`
        );
        const data = await response.json();
        const suggestions = data.map((item: any) => item.display_name);
        setLocationSuggestions(suggestions);
        setShowLocationSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocationSuggestion = (suggestion: string) => {
    setLocationName(suggestion);
    setShowLocationSuggestions(false);
    
    // Parse suggestion to extract city, province, country
    const parts = suggestion.split(", ");
    if (parts.length >= 2) {
      setCity(parts[0]);
      if (parts.length >= 3) {
        setProvince(parts[parts.length - 2]);
      }
      setCountry(parts[parts.length - 1]);
    }
  };

  const createReportMutation = trpc.reports.create.useMutation({
    onSuccess: (data) => {
      toast.success(t("create.messages.success"));
      setLocation(`/report/${data.reportId}`);
    },
    onError: (error) => {
      toast.error(error.message || t("create.messages.error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error(t("create.messages.login_required"));
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
            <CardTitle>{t("create.messages.login_required")}</CardTitle>
            <CardDescription>
              {t("create.messages.login_required")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">{t("nav.login")}</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine which fields to show based on report type
  const showRewardField = reportType === "lost_item" || reportType === "lost_person";
  const isPersonReport = reportType === "lost_person" || reportType === "find_person";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("create.title")}</h1>
          <p className="text-muted-foreground">{t("create.subtitle")}</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          {/* Report Type Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("create.report_type.title")}</CardTitle>
              <CardDescription>{t("create.report_type.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={reportType} onValueChange={(value: any) => {
                setReportType(value);
                if (value === "lost_person" || value === "find_person") {
                  setCategory("orang");
                } else {
                  setCategory("barang");
                }
              }}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
                  <TabsTrigger value="lost_item" className="py-3">
                    <Package className="w-4 h-4 mr-2" />
                    {t("create.report_type.lost_item")}
                  </TabsTrigger>
                  <TabsTrigger value="found_item" className="py-3">
                    <Package className="w-4 h-4 mr-2" />
                    {t("create.report_type.found_item")}
                  </TabsTrigger>
                  <TabsTrigger value="lost_person" className="py-3">
                    <UserSearch className="w-4 h-4 mr-2" />
                    {t("create.report_type.lost_person")}
                  </TabsTrigger>
                  <TabsTrigger value="find_person" className="py-3">
                    <UserSearch className="w-4 h-4 mr-2" />
                    {t("create.report_type.find_person")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Category Selection - Only for item reports */}
          {!isPersonReport && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("create.category.title")}</CardTitle>
                <CardDescription>{t("create.category.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <p className="font-semibold">{t("create.category.items")}</p>
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
                    <p className="font-semibold">{t("create.category.pets")}</p>
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
                    <p className="font-semibold">{t("create.category.vehicles")}</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("create.basic_info.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">{t("create.basic_info.report_title")} *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("create.basic_info.report_title_placeholder")}
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description">{t("create.basic_info.description")} *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("create.basic_info.description_placeholder")}
                  rows={5}
                  required
                  className="mt-1.5"
                />
                <Alert className="mt-2">
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    {t("create.basic_info.description_hint")}
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="locationName">{t("create.basic_info.location")}</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetCurrentLocation}
                      className="shrink-0"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Use My Location
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMap(!showMap)}
                      className="shrink-0"
                    >
                      <MapIcon className="w-4 h-4 mr-2" />
                      {showMap ? "Hide Map" : "Show Map"}
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                      id="locationName"
                      value={locationName}
                      onChange={(e) => handleLocationInput(e.target.value)}
                      onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                      onFocus={() => locationSuggestions.length > 0 && setShowLocationSuggestions(true)}
                      placeholder={t("create.basic_info.location_placeholder")}
                      className="pl-10"
                    />
                  </div>
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {locationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectLocationSuggestion(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interactive Map */}
                {showMap && (
                  <div className="col-span-full">
                    <Alert className="mb-3">
                      <Info className="w-4 h-4" />
                      <AlertDescription className="text-sm">
                        Click on the map to select a location, or drag the marker to adjust
                      </AlertDescription>
                    </Alert>
                    <Suspense fallback={<div className="h-96 w-full rounded-xl bg-muted animate-pulse" />}>
                      <InteractiveMap
                        center={mapCenter}
                        zoom={13}
                        onLocationChange={handleMapLocationChange}
                        className="h-96 w-full rounded-xl border-2 border-border"
                      />
                    </Suspense>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incidentDate">{t("create.basic_info.date")}</Label>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("common.timezone", { timezone: userTimezone }) || `Timezone: ${userTimezone}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">{t("create.basic_info.city")}</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t("create.basic_info.city_placeholder")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="province">{t("create.basic_info.province")}</Label>
                  <Input
                    id="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder={t("create.basic_info.province_placeholder")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="country">{t("create.basic_info.country")}</Label>
                  <div className="relative mt-1.5">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder={t("create.basic_info.country_placeholder")}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Specific Fields */}
          {category === "barang" && !isPersonReport && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("create.item_details.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="itemBrand">{t("create.item_details.brand")}</Label>
                    <Input
                      id="itemBrand"
                      value={itemBrand}
                      onChange={(e) => setItemBrand(e.target.value)}
                      placeholder={t("create.item_details.brand_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemColor">{t("create.item_details.color")}</Label>
                    <Input
                      id="itemColor"
                      value={itemColor}
                      onChange={(e) => setItemColor(e.target.value)}
                      placeholder={t("create.item_details.color_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemModel">{t("create.item_details.model")}</Label>
                    <Input
                      id="itemModel"
                      value={itemModel}
                      onChange={(e) => setItemModel(e.target.value)}
                      placeholder={t("create.item_details.model_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {category === "hewan" && !isPersonReport && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("create.pet_details.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="animalType">{t("create.pet_details.type")}</Label>
                    <Input
                      id="animalType"
                      value={animalType}
                      onChange={(e) => setAnimalType(e.target.value)}
                      placeholder={t("create.pet_details.type_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="animalBreed">{t("create.pet_details.breed")}</Label>
                    <Input
                      id="animalBreed"
                      value={animalBreed}
                      onChange={(e) => setAnimalBreed(e.target.value)}
                      placeholder={t("create.pet_details.breed_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="animalName">{t("create.pet_details.name")}</Label>
                    <Input
                      id="animalName"
                      value={animalName}
                      onChange={(e) => setAnimalName(e.target.value)}
                      placeholder={t("create.pet_details.name_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {category === "kendaraan" && !isPersonReport && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("create.vehicle_details.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleType">{t("create.vehicle_details.type")}</Label>
                    <Input
                      id="vehicleType"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      placeholder={t("create.vehicle_details.type_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehiclePlate">{t("create.vehicle_details.plate")}</Label>
                    <Input
                      id="vehiclePlate"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      placeholder={t("create.vehicle_details.plate_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isPersonReport && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("create.person_details.title")}</CardTitle>
                <CardDescription>
                  {reportType === "find_person" 
                    ? t("create.person_details.subtitle_find")
                    : t("create.person_details.subtitle_lost")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personName">{t("create.person_details.full_name")} *</Label>
                    <Input
                      id="personName"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder={t("create.person_details.full_name_placeholder")}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personNickname">{t("create.person_details.nickname")}</Label>
                    <Input
                      id="personNickname"
                      value={personNickname}
                      onChange={(e) => setPersonNickname(e.target.value)}
                      placeholder={t("create.person_details.nickname_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="personAge">{t("create.person_details.age")}</Label>
                    <Input
                      id="personAge"
                      type="number"
                      value={personAge}
                      onChange={(e) => setPersonAge(e.target.value)}
                      placeholder={t("create.person_details.age_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personGender">{t("create.person_details.gender")}</Label>
                    <Select value={personGender} onValueChange={(value: any) => setPersonGender(value)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t("create.person_details.gender_male")}</SelectItem>
                        <SelectItem value="female">{t("create.person_details.gender_female")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="personHeight">{t("create.person_details.height")}</Label>
                    <Input
                      id="personHeight"
                      type="number"
                      value={personHeight}
                      onChange={(e) => setPersonHeight(e.target.value)}
                      placeholder={t("create.person_details.height_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personWeight">{t("create.person_details.weight")}</Label>
                    <Input
                      id="personWeight"
                      type="number"
                      value={personWeight}
                      onChange={(e) => setPersonWeight(e.target.value)}
                      placeholder={t("create.person_details.weight_placeholder")}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="personPhysicalFeatures">{t("create.person_details.physical_features")}</Label>
                  <Textarea
                    id="personPhysicalFeatures"
                    value={personPhysicalFeatures}
                    onChange={(e) => setPersonPhysicalFeatures(e.target.value)}
                    placeholder={t("create.person_details.physical_features_placeholder")}
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {reportType === "lost_person" && (
                  <>
                    <div>
                      <Label htmlFor="personLastWearing">{t("create.person_details.last_wearing")}</Label>
                      <Textarea
                        id="personLastWearing"
                        value={personLastWearing}
                        onChange={(e) => setPersonLastWearing(e.target.value)}
                        placeholder={t("create.person_details.last_wearing_placeholder")}
                        rows={2}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="policeReportNumber">{t("create.person_details.police_report")}</Label>
                      <Input
                        id="policeReportNumber"
                        value={policeReportNumber}
                        onChange={(e) => setPoliceReportNumber(e.target.value)}
                        placeholder={t("create.person_details.police_report_placeholder")}
                        className="mt-1.5"
                      />
                    </div>
                  </>
                )}

                {reportType === "find_person" && (
                  <>
                    <div>
                      <Label htmlFor="personRelationship">{t("create.person_details.relationship")}</Label>
                      <Input
                        id="personRelationship"
                        value={personRelationship}
                        onChange={(e) => setPersonRelationship(e.target.value)}
                        placeholder={t("create.person_details.relationship_placeholder")}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personLastKnownInfo">{t("create.person_details.last_known_info")}</Label>
                      <Textarea
                        id="personLastKnownInfo"
                        value={personLastKnownInfo}
                        onChange={(e) => setPersonLastKnownInfo(e.target.value)}
                        placeholder={t("create.person_details.last_known_info_placeholder")}
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
          {showRewardField && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("create.reward.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasReward"
                    checked={hasReward}
                    onCheckedChange={(checked) => setHasReward(checked as boolean)}
                  />
                  <Label htmlFor="hasReward" className="cursor-pointer">
                    {t("create.reward.checkbox")}
                  </Label>
                </div>

                {hasReward && (
                  <div>
                    <Label htmlFor="rewardAmount">{t("create.reward.amount")}</Label>
                    <Input
                      id="rewardAmount"
                      type="number"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      placeholder={t("create.reward.amount_placeholder")}
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
              {t("create.buttons.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={createReportMutation.isPending}
              className="flex-1"
            >
              {createReportMutation.isPending ? t("create.buttons.submitting") : t("create.buttons.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

