import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import { useLocation } from "wouter";
import {
  Package,
  PawPrint,
  Car,
  UserSearch,
  MapPin,
  Zap,
  Shield,
  Users,
  Award,
  Search,
} from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header/Nav */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium text-primary">{t("app.tagline")}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
              {t("home.hero.title")}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setLocation("/explore")}
                className="text-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="w-5 h-5 mr-2" />
                {t("home.hero.cta_explore")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/create")}
                className="text-lg px-8 h-12"
              >
                {t("home.hero.cta_create")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.categories.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("home.categories.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{t("home.categories.items")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("home.categories.items_desc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-accent/50">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PawPrint className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{t("home.categories.pets")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("home.categories.pets_desc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-secondary/50">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Car className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{t("home.categories.vehicles")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("home.categories.vehicles_desc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserSearch className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{t("home.categories.missing_persons")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("home.categories.missing_persons_desc")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.features.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t("home.features.location_search")}</h3>
                <p className="text-muted-foreground">
                  {t("home.features.location_search_desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t("home.features.smart_matching")}</h3>
                <p className="text-muted-foreground">
                  {t("home.features.smart_matching_desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t("home.features.secure_communication")}</h3>
                <p className="text-muted-foreground">
                  {t("home.features.secure_communication_desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t("home.features.caring_community")}</h3>
                <p className="text-muted-foreground">
                  {t("home.features.caring_community_desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t("home.features.reputation_system")}</h3>
                <p className="text-muted-foreground">
                  {t("home.features.reputation_system_desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t("home.features.advanced_search")}</h3>
                <p className="text-muted-foreground">
                  {t("home.features.advanced_search_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("home.cta.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("home.cta.subtitle")}
            </p>
            <Button
              size="lg"
              onClick={() => setLocation("/create")}
              className="text-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all"
            >
              {t("home.cta.button")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground">
                {t("home.footer.tagline")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("home.footer.about")}</h4>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("home.footer.guide")}</h4>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("home.footer.contact")}</h4>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 {t("app.name")}. {t("home.footer.copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}

