import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/inquiries">
          <Card className="hover:shadow-xl transition">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Inquiries</h2>
              <p className="text-sm text-muted-foreground">View and manage all inquiries</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/quotations">
          <Card className="hover:shadow-xl transition">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Quotations</h2>
              <p className="text-sm text-muted-foreground">Create and track quotations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/invoices">
          <Card className="hover:shadow-xl transition">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Invoices</h2>
              <p className="text-sm text-muted-foreground">Manage client invoices</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/emails">
          <Card className="hover:shadow-xl transition">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Emails</h2>
              <p className="text-sm text-muted-foreground">Classified email list</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/products">
          <Card className="hover:shadow-xl transition">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Products</h2>
              <p className="text-sm text-muted-foreground">Add or update your product list</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/payments">
          <Card className="hover:shadow-xl transition">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Payments</h2>
              <p className="text-sm text-muted-foreground">Track all payment records</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
