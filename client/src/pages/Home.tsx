import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { 
  Search, 
  Heart, 
  MapPin, 
  Users, 
  Shield, 
  Zap,
  Package,
  PawPrint,
  Car,
  UserSearch
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
            {/* Logo/Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20 animate-scale-in">
              <Search className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
                {APP_TITLE}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Platform Gotong Royong Digital untuk Menghubungkan Kehilangan dan Penemuan
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Temukan kembali barang, hewan, kendaraan yang hilang, atau bantu reunian dengan orang yang Anda cari
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link href="/explore">
                    <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                      <Search className="w-5 h-5 mr-2" />
                      Jelajahi Laporan
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button size="lg" variant="outline" className="rounded-full px-8 border-2 hover:bg-primary/5">
                      <Zap className="w-5 h-5 mr-2" />
                      Buat Laporan
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                      Mulai Sekarang
                    </Button>
                  </a>
                  <Link href="/explore">
                    <Button size="lg" variant="outline" className="rounded-full px-8 border-2 hover:bg-primary/5">
                      Lihat Laporan
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </section>

      {/* Category Cards Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa yang Bisa Kami Bantu?</h2>
            <p className="text-lg text-muted-foreground">Pilih kategori sesuai kebutuhan Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Barang Hilang */}
            <Card className="group hover-lift rounded-2xl border-2 hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Barang</h3>
                <p className="text-sm text-muted-foreground">Dompet, ponsel, kunci, dokumen, dan barang lainnya</p>
              </CardContent>
            </Card>

            {/* Hewan Peliharaan */}
            <Card className="group hover-lift rounded-2xl border-2 hover:border-accent/50 transition-all cursor-pointer overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PawPrint className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Hewan Peliharaan</h3>
                <p className="text-sm text-muted-foreground">Kucing, anjing, burung, dan hewan kesayangan</p>
              </CardContent>
            </Card>

            {/* Kendaraan */}
            <Card className="group hover-lift rounded-2xl border-2 hover:border-secondary/50 transition-all cursor-pointer overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Car className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Kendaraan</h3>
                <p className="text-sm text-muted-foreground">Motor, mobil, dan kendaraan bermotor</p>
              </CardContent>
            </Card>

            {/* Orang Hilang */}
            <Card className="group hover-lift rounded-2xl border-2 hover:border-destructive/50 transition-all cursor-pointer overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserSearch className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">Orang Hilang</h3>
                <p className="text-sm text-muted-foreground">Pencarian orang hilang dan reunian</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Temu Kembali?</h2>
            <p className="text-lg text-muted-foreground">Fitur-fitur yang membantu Anda menemukan kembali</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4 animate-slide-up">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Pencarian Berbasis Lokasi</h3>
                <p className="text-muted-foreground">Temukan laporan di sekitar Anda dengan filter lokasi yang akurat</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Pencocokan Cerdas</h3>
                <p className="text-muted-foreground">Sistem otomatis mencocokkan laporan kehilangan dengan penemuan</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Komunikasi Aman</h3>
                <p className="text-muted-foreground">Chat terenkripsi di dalam aplikasi untuk menjaga privasi Anda</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Komunitas Peduli</h3>
                <p className="text-muted-foreground">Bergabung dengan ribuan orang yang saling membantu</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Sistem Reputasi</h3>
                <p className="text-muted-foreground">Pengguna terpercaya mendapat lencana dan poin reputasi</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.5s'}}>
              <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Pencarian Lanjutan</h3>
                <p className="text-muted-foreground">Filter berdasarkan kategori, waktu, dan karakteristik spesifik</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-100"></div>
        
        <div className="container relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Membantu atau Mendapatkan Bantuan?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas Temu Kembali dan mari saling membantu menemukan kembali yang hilang
          </p>
          {!isAuthenticated && (
            <a href={getLoginUrl()}>
              <Button size="lg" variant="secondary" className="rounded-full px-8 shadow-xl hover:shadow-2xl">
                Daftar Gratis Sekarang
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/20 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-1">{APP_TITLE}</h3>
              <p className="text-sm text-muted-foreground">Platform Gotong Royong Digital</p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Tentang Kami</a>
              <a href="#" className="hover:text-primary transition-colors">Panduan</a>
              <a href="#" className="hover:text-primary transition-colors">Privasi</a>
              <a href="#" className="hover:text-primary transition-colors">Kontak</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 {APP_TITLE}. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

