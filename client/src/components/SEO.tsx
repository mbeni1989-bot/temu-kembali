import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage = "https://www.temu-kembali.com/og-image.png",
  ogType = "website",
  canonical,
}: SEOProps) {
  const fullTitle = `${title} | Temu-Kembali`;
  const siteUrl = "https://www.temu-kembali.com";
  const canonicalUrl = canonical || siteUrl;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Update basic meta tags
    updateMetaTag("description", description);
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }
    updateMetaTag("robots", "index, follow");
    updateMetaTag("language", "Indonesian");
    updateMetaTag("author", "Temu-Kembali");

    // Update Open Graph tags
    updateMetaTag("og:type", ogType, true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("og:site_name", "Temu-Kembali", true);

    // Update Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:url", canonicalUrl);
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);
  }, [title, description, keywords, ogImage, ogType, canonical, fullTitle, canonicalUrl]);

  return null;
}

// Pre-configured SEO configs for different pages
export const SEOConfigs = {
  home: {
    title: "Beranda",
    description: "Platform untuk melaporkan dan menemukan barang hilang, hewan peliharaan, dan orang hilang. Bantu sesama menemukan kembali yang hilang.",
    keywords: "barang hilang, hewan hilang, orang hilang, temukan barang, lapor kehilangan, Indonesia",
  },
  explore: {
    title: "Jelajahi Laporan",
    description: "Jelajahi laporan barang hilang, hewan peliharaan, dan orang hilang. Bantu orang lain menemukan kembali yang mereka cari.",
    keywords: "cari barang hilang, temukan hewan, laporan kehilangan, Indonesia",
  },
  create: {
    title: "Buat Laporan",
    description: "Buat laporan barang hilang atau ditemukan. Semakin detail informasi yang Anda berikan, semakin mudah untuk menemukan kembali.",
    keywords: "buat laporan, lapor kehilangan, lapor barang ditemukan",
  },
  messages: {
    title: "Pesan",
    description: "Kelola pesan dan komunikasi dengan pengguna lain terkait laporan kehilangan.",
    keywords: "pesan, chat, komunikasi",
  },
  profile: {
    title: "Profil",
    description: "Kelola profil dan laporan Anda di Temu-Kembali.",
    keywords: "profil, akun, laporan saya",
  },
  about: {
    title: "Tentang Kami",
    description: "Pelajari lebih lanjut tentang Temu-Kembali, platform yang membantu menemukan kembali yang hilang.",
    keywords: "tentang, misi, visi, tim",
  },
  contact: {
    title: "Kontak",
    description: "Hubungi kami untuk pertanyaan, saran, atau bantuan terkait Temu-Kembali.",
    keywords: "kontak, hubungi kami, bantuan, dukungan",
  },
  donate: {
    title: "Donasi",
    description: "Dukung Temu-Kembali dengan donasi untuk membantu lebih banyak orang menemukan kembali yang hilang.",
    keywords: "donasi, dukungan, kontribusi",
  },
};
