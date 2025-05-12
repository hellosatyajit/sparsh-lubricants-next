import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Payments", href: "/payments" },
];

export default function Payments() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex justify-center items-center w-full h-full p-2 sm:p-6 lg:p-8">
                Working in progress...
            </div>
        </AppLayout>
    )
}
