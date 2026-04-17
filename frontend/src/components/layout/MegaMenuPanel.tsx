import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router-dom';
import type { NavMenuItem, MegaMenuSection } from '@/types/navigation';
import { motion } from 'framer-motion';
import { resolveMegaMenuLink } from '@/lib/catalogResolver';

interface MegaMenuPanelProps {
  item: NavMenuItem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MegaMenuPanel = ({ item, onMouseEnter, onMouseLeave }: MegaMenuPanelProps) => {
  if (!item.sections?.length) return null;

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
          {item.sections.map((section) => (
            <MegaMenuColumn key={section.id} section={section} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const MegaMenuColumn = ({ section }: { section: MegaMenuSection }) => {
  const { t } = useLocale();

  return (
    <div className="min-w-0">
      <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
        {section.href ? (
          <Link to={section.href} className="hover:text-brand transition-colors">
            {t(section.title)}
          </Link>
        ) : t(section.title)}
      </h4>
      <ul className="space-y-1.5">
        {section.links.map((link) => (
          <li key={link.id}>
            <Link
              to={resolveMegaMenuLink(link.id)}
              className="block text-[13px] text-muted-foreground hover:text-brand transition-colors py-0.5"
            >
              {t(link.label)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MegaMenuPanel;
