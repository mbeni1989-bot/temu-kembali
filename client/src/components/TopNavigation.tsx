import { useLocation } from "wouter";
import { Search, MoreVertical, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNavigation() {
  const [location, setLocation] = useLocation();
  // Get search params from URL
  const params = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = params.get('q') || '';
  const initialType = params.get('type') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Sync state with URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get('q') || '');
    setSelectedType(params.get('type') || 'all');
  }, [location, window.location.search]);

  // Check if we're on the Explore page
  const isExplorePage = location.startsWith("/explore");

  const typeFilters = [
    { value: 'all', label: 'Semua Laporan' },
    { value: 'lost_item', label: 'Kehilangan' },
    { value: 'found_item', label: 'Penemuan' },
    { value: 'lost_person', label: 'Orang Hilang' },
    { value: 'find_person', label: 'Cari Seseorang' },
  ];

  const navigateAndNotify = (url: string) => {
    setLocation(url);
    // Force a custom event to notify components that URL params might have changed
    // since wouter doesn't always trigger re-renders for query param changes
    window.dispatchEvent(new Event('locationchange'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const filterParam = selectedType !== 'all' ? `&type=${selectedType}` : '';
    
    if (query || selectedType !== 'all') {
      navigateAndNotify(`/explore?q=${encodeURIComponent(query)}${filterParam}`);
    } else {
      navigateAndNotify("/explore");
    }
  };

  const handleFilterSelect = (type: string) => {
    setSelectedType(type);
    const query = searchQuery.trim();
    const filterParam = type !== 'all' ? `&type=${type}` : '';
    
    if (query || type !== 'all') {
      navigateAndNotify(`/explore?q=${encodeURIComponent(query)}${filterParam}`);
    } else {
      navigateAndNotify("/explore");
    }
    setShowFilterMenu(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (selectedType !== 'all') {
      navigateAndNotify(`/explore?type=${selectedType}`);
    } else {
      navigateAndNotify("/explore");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/20 backdrop-blur-lg border-b border-border rounded-b-[24px] shadow-sm">
      <div className="container">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-center border-b border-border">
          <button
            onClick={() => setLocation("/")}
            className="hover:opacity-80 transition-opacity"
          >
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent text-center" 
              style={{ fontFamily: '"Pacifico", cursive' }}
            >
              Temu-Kembali
            </h1>
          </button>
        </div>

        {/* Search & Filter Bar - Only on Explore Page */}
        <AnimatePresence>
          {isExplorePage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-visible"
            >
              <div className="py-3 px-4">
                <form onSubmit={handleSearch} className="flex gap-2 items-center relative">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Cari barang, hewan, orang, lokasi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 bg-background border-2 border-border rounded-lg focus:border-primary focus:bg-background transition-all duration-200 text-sm"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Dropdown Button */}
                  <div className="relative z-50">
                    <motion.button
                      type="button"
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className="flex items-center justify-center px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg border-2 border-primary/30 transition-all duration-200 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Filter laporan"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </motion.button>

                    {/* Filter Menu */}
                    <AnimatePresence>
                      {showFilterMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full right-0 mt-2 w-48 bg-background border-2 border-border rounded-lg shadow-xl z-50"
                        >
                          <div className="p-2">
                            {typeFilters.map((filter) => (
                              <motion.button
                                key={filter.value}
                                type="button"
                                onClick={() => handleFilterSelect(filter.value)}
                                className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                                  selectedType === filter.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-primary/10 text-foreground'
                                }`}
                                whileHover={{ x: 4 }}
                              >
                                {filter.label}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Search Button */}
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Cari</span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
