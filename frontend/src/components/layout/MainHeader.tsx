import { useState, useRef, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, ChevronDown, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCategories } from '@/hooks/useCatalog';
import { useSearch, type SearchResult } from '@/hooks/useSearch';
import logoImg from '@/assets/logo.png';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MobileMenu from './MobileMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { routes } from '@/lib/routes';

const MainHeader = () => {
  const { t, lang } = useLocale();
  const { settings } = useSettings();
  const { isLoggedIn, user } = useAuth();
  const { count: cartCount, setDrawerOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [catOpen, setCatOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Search state using the new hook
  const { searchTerm, searchResults, setSearchTerm } = useSearch();
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get categories from API
  const { categories } = useCategories();

  const showSearchDropdown = searchFocused && searchResults.length > 0;

  const searchPlaceholder = lang === 'ar' ? 'ابحث عن منتجات...' : 'Search for products...';
  const allCategoriesLabel = lang === 'ar' ? 'جميع الفئات' : 'All Categories';

  // Close on route change
  useEffect(() => { setCatOpen(false); setSearchTerm(''); setSearchFocused(false); }, [location.pathname, setSearchTerm]);

  // Close on outside click
  useEffect(() => {
    if (!catOpen) return;
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [catOpen]);

  // Close search on outside click
  useEffect(() => {
    if (!searchFocused) return;
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchFocused]);

  const handleSearchResultClick = (result: SearchResult) => {
    navigate(result.href);
    setSearchTerm('');
    setSearchFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to first result or shop page
      if (searchResults.length > 0) {
        navigate(searchResults[0].href);
      } else {
        navigate(routes.shop);
      }
      setSearchTerm('');
      setSearchFocused(false);
    }
  };

  const selectedCat = hoveredCat ? categories.find(c => c.id === hoveredCat) : null;
  const selectedSub = hoveredSub && selectedCat ? selectedCat.subcategories.find(s => s.id === hoveredSub) : null;

  const resultTypeLabel = (type: SearchResult['type']) => {
    if (lang === 'ar') {
      switch (type) {
        case 'product': return 'منتج';
        case 'productType': return 'نوع';
        case 'subcategory': return 'تصنيف فرعي';
        case 'category': return 'فئة';
        case 'brand': return 'علامة تجارية';
      }
    }
    switch (type) {
      case 'product': return 'Product';
      case 'productType': return 'Type';
      case 'subcategory': return 'Subcategory';
      case 'category': return 'Category';
      case 'brand': return 'Brand';
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-[80]">
      <div className="container mx-auto max-w-7xl flex items-center justify-center h-16 md:h-20 gap-4 px-4">
        {/* Mobile hamburger */}
        <div className="lg:hidden flex-shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 text-foreground" aria-label="Menu">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side={lang === 'ar' ? 'right' : 'left'} className="w-[300px] p-0">
              <MobileMenu />
            </SheetContent>
          </Sheet>
        </div>

        {/* All Categories dropdown – 3-column browser */}
        <div className="hidden lg:block relative flex-shrink-0" ref={catRef}>
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <Menu size={16} />
            <span>{allCategoriesLabel}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {catOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full start-0 mt-1.5 bg-popover border border-border rounded-xl shadow-xl z-[70] overflow-visible flex"
              >
                {/* Column 1: Categories */}
                <div className="w-52 py-1.5 border-e border-border max-h-[70vh] overflow-y-auto">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      onMouseEnter={() => { setHoveredCat(cat.id); setHoveredSub(null); }}
                    >
                      <Link
                        to={routes.category(cat.slug)}
                        onClick={() => setCatOpen(false)}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${hoveredCat === cat.id ? 'bg-accent text-accent-foreground' : 'text-popover-foreground hover:bg-accent'
                          }`}
                      >
                        <span>{t(cat.name)}</span>
                        {cat.subcategories.length > 0 && <ChevronRight size={12} className="text-muted-foreground" />}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Column 2: Subcategories */}
                {selectedCat && selectedCat.subcategories.length > 0 && (
                  <div className="w-52 py-1.5 border-e border-border max-h-[70vh] overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t(selectedCat.name)}
                    </div>
                    {selectedCat.subcategories.map(sub => (
                      <div
                        key={sub.id}
                        onMouseEnter={() => setHoveredSub(sub.id)}
                      >
                        <Link
                          to={routes.subcategory(selectedCat.slug, sub.slug)}
                          onClick={() => setCatOpen(false)}
                          className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${hoveredSub === sub.id ? 'bg-accent text-accent-foreground' : 'text-popover-foreground hover:bg-accent'
                            }`}
                        >
                          <span>{t(sub.name)}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {sub.productCount}
                            {sub.productTypes.length > 0 && <ChevronRight size={10} />}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Column 3: Product Types */}
                {selectedSub && selectedSub.productTypes.length > 0 && selectedCat && (
                  <div className="w-52 py-1.5 max-h-[70vh] overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t(selectedSub.name)}
                    </div>
                    {selectedSub.productTypes.map(pt => (
                      <Link
                        key={pt.id}
                        to={routes.productType(selectedCat.slug, selectedSub.slug, pt.slug)}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
                      >
                        <span>{t(pt.name)}</span>
                        <span className="text-xs text-muted-foreground">{pt.productCount}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search bar - desktop */}
        <div className="hidden md:flex flex-1 min-w-0 max-w-lg relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder={searchPlaceholder}
              className="w-full h-10 ps-10 pe-4 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </form>

          {/* Search suggestions dropdown */}
          <AnimatePresence>
            {showSearchDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full start-0 end-0 mt-1.5 bg-popover border border-border rounded-xl shadow-xl z-[90] max-h-[60vh] overflow-y-auto py-1"
              >
                {searchResults.map((result, i) => (
                  <button
                    key={`${result.type}-${result.id}-${i}`}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-start hover:bg-accent transition-colors"
                  >
                    {result.image && (
                      <img src={result.image} alt="" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-popover-foreground truncate">{t(result.label)}</div>
                      {result.sublabel && (
                        <div className="text-xs text-muted-foreground truncate">{t(result.sublabel)}</div>
                      )}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground flex-shrink-0">
                      {resultTypeLabel(result.type)}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logo - centered */}
        <div className="flex-1 lg:flex-none flex justify-center flex-shrink-0 px-2">
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="Mayar Shop"
              className="h-10 md:h-12 w-auto max-w-[140px] md:max-w-[160px] object-contain"
            />
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1 md:gap-2 lg:gap-3 flex-shrink-0 ms-auto lg:ms-0">
          {/* Mobile search */}
          <button className="md:hidden p-2 text-foreground" aria-label="Search">
            <Search size={20} />
          </button>

          {settings?.enableMyAccount && (
            <>
              {isLoggedIn ? (
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 px-2 py-1.5 text-foreground hover:text-brand transition-colors"
                  title={user?.name}
                >
                  <User size={19} />
                  <span className="hidden lg:inline text-xs font-medium">{lang === 'ar' ? 'حسابي' : 'My Account'}</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-1.5 px-2 py-1.5 text-foreground hover:text-brand transition-colors"
                  >
                    <LogIn size={19} />
                    <span className="hidden lg:inline text-xs font-medium">{lang === 'ar' ? 'دخول' : 'Login'}</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden md:flex items-center gap-1.5 px-2 py-1.5 text-foreground hover:text-brand transition-colors"
                  >
                    <UserPlus size={19} />
                    <span className="hidden lg:inline text-xs font-medium">{lang === 'ar' ? 'تسجيل' : 'Sign Up'}</span>
                  </Link>
                  <Link
                    to="/login"
                    className="md:hidden p-2 text-foreground hover:text-brand transition-colors"
                    aria-label="Login"
                  >
                    <User size={20} />
                  </Link>
                </>
              )}
            </>
          )}

          {settings?.enableWishlist && (
            <Link to={isLoggedIn ? '/account?section=wishlist' : '/login'} className="hidden md:flex relative p-2 text-foreground hover:text-brand transition-colors" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}
          <button onClick={() => setDrawerOpen(true)} className="relative p-2 text-foreground hover:text-brand transition-colors" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 bg-brand text-brand-foreground text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
