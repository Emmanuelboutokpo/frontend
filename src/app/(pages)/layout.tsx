import Footer from "@/components/front-office/Footer";
import Navbar from "@/components/front-office/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <>
        <Navbar />
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
        <Footer />
    </>
  );
}
