import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Calendar,
  Package,
  PawPrint,
  Car,
  UserSearch,
  Eye,
  MessageCircle
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function Explore() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"lost_item" | "found_item" | "lost_person" | "find_person">("lost_item");

  const { data: reports, isLoading } = trpc.reports.getByType.useQuery({
    type: activeTab,
    limit: 50,
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

  const filteredReports = reports?.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Jelajahi Laporan</h1>
          <p className="text-muted-foreground">Temukan atau bantu orang lain menemukan kembali yang hilang</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari laporan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <div className="overflow-x-auto mb-8 -mx-4 px-4">
            <TabsList className="inline-flex gap-2 bg-transparent p-0 h-auto min-w-full">
              <TabsTrigger 
                value="lost_item" 
                className="flex-shrink-0 rounded-full px-6 py-3 border-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=inactive]:border-border"
              >
                <Package className="w-4 h-4 mr-2" />
                Barang Hilang
              </TabsTrigger>
              <TabsTrigger 
                value="found_item" 
                className="flex-shrink-0 rounded-full px-6 py-3 border-2 data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:border-accent data-[state=inactive]:border-border"
              >
                <Package className="w-4 h-4 mr-2" />
                Barang Ditemukan
              </TabsTrigger>
              <TabsTrigger 
                value="lost_person" 
                className="flex-shrink-0 rounded-full px-6 py-3 border-2 data-[state=active]:bg-destructive data-[state=active]:text-white data-[state=active]:border-destructive data-[state=inactive]:border-border"
              >
                <UserSearch className="w-4 h-4 mr-2" />
                Orang Hilang
              </TabsTrigger>
              <TabsTrigger 
                value="find_person" 
                className="flex-shrink-0 rounded-full px-6 py-3 border-2 data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:border-secondary data-[state=inactive]:border-border"
              >
                <UserSearch className="w-4 h-4 mr-2" />
                Cari Seseorang
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="h-48 bg-muted rounded-t-xl"></CardHeader>
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredReports && filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <Link key={report.id} href={`/report/${report.id}`}>
                    <Card className="group hover-lift rounded-2xl border-2 hover:border-primary/50 transition-all cursor-pointer overflow-hidden h-full">
                      {/* Image */}
                      {report.images && JSON.parse(report.images).length > 0 ? (
                        <div className="relative h-48 overflow-hidden bg-muted">
                          <img
                            src={JSON.parse(report.images)[0]}
                            alt={report.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            {getStatusBadge(report.status)}
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                          {getCategoryIcon(report.category)}
                          <div className="absolute top-3 right-3">
                            {getStatusBadge(report.status)}
                          </div>
                        </div>
                      )}

                      <CardContent className="p-6">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          {getCategoryIcon(report.category)}
                          <Badge variant="outline" className="capitalize">
                            {report.category}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {report.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {report.description}
                        </p>

                        {/* Meta Info */}
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {report.locationName && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{report.locationName}</span>
                            </div>
                          )}
                          {report.incidentDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span>{format(new Date(report.incidentDate as any), "d MMMM yyyy", { locale: id })}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{report.viewCount || 0}</span>
                        </div>
                        <span className="text-xs">
                          {report.createdAt && format(new Date(report.createdAt as any), "d MMM yyyy", { locale: id })}
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tidak Ada Laporan</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Tidak ditemukan laporan yang sesuai dengan pencarian Anda"
                    : `Belum ada laporan ${getTypeLabel(activeTab).toLowerCase()} saat ini`}
                </p>
                <Link href="/create">
                  <Button>Buat Laporan Pertama</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

