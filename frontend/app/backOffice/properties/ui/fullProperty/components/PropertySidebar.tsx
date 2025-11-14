'use client';

interface PropertySidebarProps {
  sections: Array<{ id: string; label: string; icon: string }>;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  className?: string;
}

export default function PropertySidebar({
  sections,
  activeSection,
  onSectionChange,
  className = ''
}: PropertySidebarProps) {
  return (
    <aside className={`bg-background text-foreground flex flex-col shadow-lg border-r border-border/20 overflow-y-auto ${className}`}>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-2 py-2 rounded-lg transition-all duration-200 font-medium text-sm group relative flex items-center gap-3 ${
                  activeSection === section.id
                    ? 'text-secondary bg-secondary/5'
                    : 'text-foreground/90 hover:text-foreground'
                }`}
                title={section.label}
                aria-label={`Ir a ${section.label}`}
                aria-current={activeSection === section.id ? 'page' : undefined}
                data-test-id={`section-${section.id}`}
              >
                <span className={`material-symbols-outlined text-lg flex-shrink-0 ${
                  activeSection === section.id ? 'text-secondary' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {section.icon}
                </span>
                <span className="truncate hidden md:inline">{section.label}</span>
                {activeSection === section.id && (
                  <span className="material-symbols-outlined text-sm ml-auto text-secondary flex-shrink-0">
                    check_circle
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
