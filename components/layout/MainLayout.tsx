import Navbar from './Navbar';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';
import CustomCursor from '@/components/ui/Cursor';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
