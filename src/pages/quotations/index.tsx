"use client";

import Head from "next/head";
import { Button } from "../../components/ui/button";
import AppLayout from "../../layouts/app-layout";
import { BreadcrumbItem } from "../../types";
import { z } from "zod";
import { useSession } from "next-auth/react";
import Link from "next/link";

const quotationTemplateSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Template name is required"),
  products: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, "Product name is required"),
      price: z.coerce.number().min(0, "Price is required"),
      quantity: z.coerce.number().min(1, "Quantity is required"),
    })
  ),
});

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Quotation",
    href: "/quotations",
  },
];

export default function QuotationTemplates() {
  const { data: session } = useSession();

  return (
    <AppLayout breadcrumbs={breadcrumbs} cta={<div className="flex gap-2">
      {
        session?.user?.type === "Admin" && (
          <Button asChild>
            <Link href="/quotations/templates">
              Manage Templates
            </Link>
          </Button>
        )
      }
    </div>}>
      <Head>
        <title>Quotation</title>
      </Head>
    </AppLayout>
  );
}
