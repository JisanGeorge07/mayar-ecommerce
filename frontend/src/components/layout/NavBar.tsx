import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { useNavbarItems, type GeneratedMegaMenu } from '@/hooks/useCatalog';
import { AnimatePresence, motion } from 'framer-motion';

const NavBar = () => {
  const { t } = useLocale();
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { navItems } = useNavbarItems();

  const clearClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const scheduleClose = useCallback(() => {
    clearClose();
    closeTimer.current = setTimeout(() => setActiveId(null), 180);
  }, [clearClose]);

  const handleEnter = useCallback((id: string) => {
    clearClose();
    setActiveId(id);
  }, [clearClose]);

  const activeItem = navItems.find(i => i.id === activeId && i.type === 'mega');

  return (
    <>
      <nav className="hidden lg:block bg-background border-b border-border relative z-50">
        <div className="container">
          <ul className="flex items-center justify-center gap-8 h-11">
            {navItems.map(item => {
              const isMega = item.type === 'mega';
              const isActive = activeId === item.id;

              return (
                <li
                  key={item.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={isMega ? () => handleEnter(item.id) : undefined}
                  onMouseLeave={isMega ? scheduleClose : undefined}
                >
                  <Link
                    to={item.slug}
                    className={`relative text-sm font-medium transition-colors inline-flex items-center gap-1.5 py-2 ${isActive ? 'text-brand' : 'text-foreground hover:text-brand'
                      }`}
                    onFocus={isMega ? () => handleEnter(item.id) : undefined}
                  >
                    {t(item.label)}
                    {item.badge && (
                      <span className="bg-brand text-brand-foreground text-[9px] px-1.5 py-px rounded-full font-bold leading-none">
                        {t(item.badge)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mega menu panel */}
      <AnimatePresence>
        {activeItem && (
          <CatalogMegaPanel
            key={activeItem.id}
            item={activeItem}
            onMouseEnter={clearClose}
            onMouseLeave={scheduleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const CatalogMegaPanel = ({ item, onMouseEnter, onMouseLeave }: {
  item: GeneratedMegaMenu;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const { t } = useLocale();

  if (!item.sections.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="relative z-50 bg-background border-b border-border shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-6 max-h-[70vh] overflow-y-auto">
          {item.sections.map(section => (
            <div key={section.id} className="min-w-0">
              <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
                <Link to={section.href} className="hover:text-brand transition-colors">
                  {t(section.title)}
                </Link>
              </h4>
              <ul className="space-y-1.5">
                {section.links.map(link => (
                  <li key={link.id}>
                    <Link
                      to={link.href}
                      className="block text-[13px] text-muted-foreground hover:text-brand transition-colors py-0.5"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NavBar;
