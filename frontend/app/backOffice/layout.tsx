import TopBar from '../../components/TopBar/TopBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopBar />
      <main>{children}</main>
    </div>
  );
}