import NavBar from '../ui/NavBar';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* NavBar - Sticky under TopBar */}
      <div className="sticky top-16 z-40 bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)]">
        <NavBar />
      </div>
      {children}
    </>
  );
}
