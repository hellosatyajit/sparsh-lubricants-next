import Sidebar from "../../src/resources/js/components/ui/sidebar";
import Navbar from "../resources/js/components/nav-main";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1">
            <Navbar />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}