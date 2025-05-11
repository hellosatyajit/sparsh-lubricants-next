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
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import useSWR from 'swr';
import { fetcher, swrConfig } from '@/lib/swr';

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

interface Props {
  templates: QuotationTemplate[];
  templateProducts: { id: number; name: string; price: number }[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Quotation",
    href: "/quotations",
  },
  {
    title: "Templates",
    href: "/quotations/templates",
  },
];

export default function QuotationTemplates() {
  const { data: templatesData, error: templatesError, mutate: mutateTemplates } = useSWR<QuotationTemplate[]>(
    `/api/quotation/templates`,
    fetcher,
    swrConfig
  );
  const { data: productsData, error: productsError } = useSWR<{ id: number; name: string; price: number }[]>(
    `/api/quotation/templates/products`,
    fetcher,
    swrConfig
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuotationTemplate | null>(null);
  
  const form = useForm<QuotationTemplate>({
    resolver: zodResolver(quotationTemplateSchema),
    defaultValues: {
      name: "",
      products: [{ name: "", price: 0, quantity: 1 }],
    },
  });

  const { fields: productFields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    if (isAddOpen) {
      form.reset({
        name: "",
        products: [{ name: "", price: 0, quantity: 1 }],
      });
      setSelectedTemplate(null);
    }
  }, [isAddOpen]);

  const onSubmit = async (data: QuotationTemplate) => {
    try {
      const response = await fetch(`/api/quotation/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setIsEditOpen(false);
        setSelectedTemplate(null);
        setIsAddOpen(false);
        form.reset();
        mutateTemplates();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (template: QuotationTemplate) => {
    setSelectedTemplate(template);
    form.reset(template);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/quotation/templates/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIsDeleteOpen(false);
        setSelectedTemplate(null);
        mutateTemplates();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const AddTemplateDialog = () => (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogTrigger asChild>
        <Button>Add Template</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Template Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-2">
              <select value={''} className="flex-1" onChange={(e) => {
                const selectedProduct = (productsData ?? []).find(product => product.id === parseInt(e.target.value));
                if (selectedProduct) {
                  append({ name: selectedProduct.name, price: selectedProduct.price, quantity: 1 });
                }
              }}>
                <option value="">Select a product</option>
                {(productsData ?? []).map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", price: 0, quantity: 1 })}
              >
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-1!">
              <label className="col-span-4">Product Name</label>
              <label>Price</label>
              <label>Quantity</label>
            </div>

            {productFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-7 gap-2">
                <FormField
                  control={form.control}
                  name={`products.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name={`products.${index}.price`} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name={`products.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                <Button
                  variant="destructive"
                  size="icon"
                  className="col-span-1"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  if (templatesError || productsError) {
    return <div>Error loading data</div>;
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs} cta={<AddTemplateDialog />}>
      <Head>
        <title>Quotation Templates</title>
      </Head>
      <div className="mx-auto w-full max-w-7xl p-2 sm:p-6 lg:p-8">
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Template Name</TableHead>
                <TableHead>Total Products</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(templatesData ?? []).map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="pl-4">{template.name}</TableCell>
                  <TableCell>{template.products.length}</TableCell>
                  <TableCell>₹{template.products.reduce((sum, item) => sum + item.price, 0)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        Edit
                      </Button>
                      <Dialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedTemplate(template)}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Template</DialogTitle>
                          </DialogHeader>
                          <p>Are you sure you want to delete this template?</p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDeleteOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(template.id!)}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
