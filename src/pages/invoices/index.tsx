import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Invoices", href: "/invoices" },
];

export default function Invoices() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex justify-center items-center w-full h-full p-2 sm:p-6 lg:p-8">
                Working in progress...
            </div>
        </AppLayout>
    )
}
