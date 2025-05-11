"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";
import AppLayout from "../../layouts/app-layout";
import { BreadcrumbItem } from "../../types";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSWR from 'swr';
import { fetcher, swrConfig } from '@/lib/swr';
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

type QuotationTemplate = z.infer<typeof quotationTemplateSchema>;

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
