import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import SEO, { SEOConfigs } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar,
  Package,
  PawPrint,
  Car,
  UserSearch,
  Eye,
  Info,
  Zap,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";

export default function Explore() {
  const { t } = useTranslation();
  const [location] = useLocation();
  
  // State for filters to ensure reactivity
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showNotification, setShowNotification] = useState(true);

  // Sync state with URL
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('q') || "");
      setSelectedType(params.get('type') || "all");
    };

    // Initial sync
    handleLocationChange();

    // Listen for navigation events
    window.addEventListener('popstate', handleLocationChange);
    
    // Custom event for internal navigation if needed
    window.addEventListener('locationchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('locationchange', handleLocationChange);
    };
  }, [location]);

  // Fetch all report types
  const lostItems = trpc.reports.getByType.useQuery({ type: 'lost_item', limit: 100 });
  const foundItems = trpc.reports.getByType.useQuery({ type: 'found_item', limit: 100 });
  const lostPersons = trpc.reports.getByType.useQuery({ type: 'lost_person', limit: 100 });
  const findPersons = trpc.reports.getByType.useQuery({ type: 'find_person', limit: 100 });
  
  const isLoading = lostItems.isLoading || foundItems.isLoading || lostPersons.isLoading || findPersons.isLoading;
  
  // Merge all reports
  const allReports = [
    ...(lostItems.data?.items || []),
    ...(foundItems.data?.items || []),
    ...(lostPersons.data?.items || []),
    ...(findPersons.data?.items || []),
  ];

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

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "lost_item":
        return "bg-red-100 text-red-800 border-red-200";
      case "found_item":
        return "bg-green-100 text-green-800 border-green-200";
      case "lost_person":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "find_person":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let results = allReports.filter((report: any) => {
      // Type filter
      if (selectedType !== 'all' && report.type !== selectedType) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
          report.title?.toLowerCase().includes(query) ||
          report.description?.toLowerCase().includes(query) ||
          report.locationName?.toLowerCase().includes(query) ||
          report.city?.toLowerCase().includes(query) ||
          report.province?.toLowerCase().includes(query)
        );
        if (!matchesSearch) return false;
      }

      return true;
    });

    // Sort by creation date (newest first)
    return results.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [allReports, selectedType, searchQuery]);

  return (
    <>
      <SEO {...SEOConfigs.explore} />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
          <div className="container py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Jelajahi Laporan</h1>
            <p className="text-muted-foreground text-sm">Temukan atau bantu orang lain menemukan kembali yang hilang</p>
          </div>
        </div>

        {/* Matching System Explanation */}
        {showNotification && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="container py-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-start relative"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Sistem Pencocokan Otomatis</h3>
                  <p className="text-sm text-blue-800">
                    Platform kami menggunakan sistem pencocokan dua arah yang cerdas. Ketika Anda membuat laporan "Hilang" atau "Ditemukan", sistem secara otomatis mencari laporan yang berpotensi cocok dari pengguna lain. Jika ditemukan kecocokan, kedua belah pihak akan menerima notifikasi untuk dapat berkomunikasi dan memverifikasi apakah laporan tersebut benar-benar cocok. Semakin detail informasi yang Anda berikan, semakin akurat pencocokannya!
                  </p>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="flex-shrink-0 p-1 hover:bg-blue-200 rounded-full transition-colors"
                  title="Tutup pesan"
                >
                  <X className="w-5 h-5 text-blue-600" />
                </button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container py-8">
          {/* Results Info */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <p className="text-sm text-muted-foreground">
                Menampilkan <span className="font-semibold text-foreground">{filteredReports.length}</span> laporan
                {selectedType !== 'all' && ` (${getTypeLabel(selectedType)})`}
                {searchQuery && ` • Pencarian: "${searchQuery}"`}
              </p>
            </motion.div>
          )}

          {/* Reports Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-xl"></div>
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : filteredReports && filteredReports.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {filteredReports.map((report, idx) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/report/${report.id}`}>
                    <Card className="group hover-lift rounded-2xl border-2 border-transparent hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden h-full hover:shadow-lg">
                      {/* Image */}
                      {report.images && JSON.parse(report.images).length > 0 ? (
                        <div className="relative h-48 overflow-hidden bg-muted">
                          <img
                            src={JSON.parse(report.images)[0]}
                            alt={report.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3">
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge className={`${getTypeBadgeColor(report.type)} border`}>
                              {getTypeLabel(report.type)}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                          {getCategoryIcon(report.category)}
                          <div className="absolute top-3 right-3">
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge className={`${getTypeBadgeColor(report.type)} border`}>
                              {getTypeLabel(report.type)}
                            </Badge>
                          </div>
                        </div>
                      )}

                      <CardContent className="p-6">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          {getCategoryIcon(report.category)}
                          <Badge variant="outline" className="capitalize text-xs">
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
                          {/* Location */}
                          {report.locationName && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{report.locationName}</span>
                            </div>
                          )}

                          {/* Creation Date */}
                          {report.createdAt && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span>
                                {format(new Date(report.createdAt as any), "d MMM yyyy", { locale: id })}
                              </span>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="flex items-center gap-4 pt-2 border-t">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{report.viewCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tidak ada laporan ditemukan</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Coba ubah filter pencarian Anda atau buat laporan baru'}
              </p>
              <Link href="/create">
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Buat Laporan
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
