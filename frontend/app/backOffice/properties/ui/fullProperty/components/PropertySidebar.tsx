'use client';

interface PropertySidebarProps {
  sections: Array<{ id: string; label: string; icon: string }>;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export default function PropertySidebar({
  sections,
  activeSection,
  onSectionChange
}: PropertySidebarProps) {
  return (
    <aside className="w-16 sm:w-20 md:w-64 bg-background text-foreground flex flex-col shadow-lg border-r border-border/20">
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm group relative ${
                  activeSection === section.id
                    ? 'text-secondary'
                    : 'text-foreground/90 hover:text-foreground'
                }`}
                data-test-id={`section-${section.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-lg ${
                    activeSection === section.id ? 'text-secondary' : 'text-muted-foreground group-hover:text-foreground'
                  }`}>
                    {section.icon}
                  </span>
                  <span className="truncate hidden md:inline">{section.label}</span>
                  {activeSection === section.id && (
                    <span className="material-symbols-outlined text-xs ml-auto text-secondary animate-pulse">
                      chevron_right
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
