import "./globals.css";
import Shell from "@/components/Shell";
export const metadata = { title: "Inventaris SMK Mitra Batik Tasikmalaya", description: "Sistem informasi inventaris barang sekolah" };
const themeScript = `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;
export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
