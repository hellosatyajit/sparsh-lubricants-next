"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSWR from 'swr';
import { fetcher, swrConfig } from '@/lib/swr';

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price is required"),
});

type Product = z.infer<typeof productSchema>;

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface Props {
  products: PaginatedData<Product>;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Products",
    href: "/products",
  },
];

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);

  const { data: productsData, error, mutate: mutateProducts } = useSWR<PaginatedData<Product>>(
    `/api/products?page=${page}`,
    fetcher,
    swrConfig
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (isAddOpen) {
      form.reset({
        name: "",
        category: "",
        description: "",
        price: 0,
      });
      setSelectedProduct(null);
    }
  }, [isAddOpen, form]);

  const onSubmit = async (data: Product) => {
    try {
      if (selectedProduct) {
        const response = await fetch(`/api/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          setIsEditOpen(false);
          setSelectedProduct(null);
          form.reset();
          mutateProducts();
        }
      } else {
        const response = await fetch(`/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          setIsAddOpen(false);
          form.reset();
          mutateProducts();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    form.reset(product);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIsDeleteOpen(false);
        setSelectedProduct(null);
        mutateProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/products?page=${newPage}`);
  };

  const AddProductDialog = () => (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {["name", "category", "description", "price"].map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={
                  field as keyof Omit<
                    Product,
                    "id" | "created_at" | "updated_at" | "deleted_at"
                  >
                }
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {field.name[0].toUpperCase() + field.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      {field.name === "description" ? (
                        <Textarea {...field} />
                      ) : (
                        <Input
                          {...field}
                          type={field.name === "price" ? "number" : "text"}
                          step={field.name === "price" ? "0.01" : undefined}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  if (error) {
    return <div>Error loading products</div>;
  }

  const products = productsData?.data || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs} cta={<AddProductDialog />}>
      <Head>
        <title>Products</title>
      </Head>
      <div className="mx-auto w-full max-w-7xl p-2 sm:p-6 lg:p-8">
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="max-w-52">Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pl-4">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell
                    className="max-w-52 truncate"
                    title={product.description || ""}
                  >
                    {product.description}
                  </TableCell>
                  <TableCell>₹{Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
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
                            onClick={() => setSelectedProduct(product)}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Product</DialogTitle>
                          </DialogHeader>
                          <p>Are you sure you want to delete this product?</p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDeleteOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(product.id!)}
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

        {(productsData?.last_page && productsData.last_page > 1) && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{productsData.from}</span> to{" "}
                <span className="font-medium">{productsData.to}</span> of{" "}
                <span className="font-medium">{productsData.total}</span> results
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={productsData.current_page === 1}
                onClick={() => handlePageChange(productsData.current_page - 1)}
              >
                <ChevronLeftIcon />
              </Button>
              {Array.from({ length: productsData.last_page }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={
                      page === productsData.current_page ? "default" : "outline"
                    }
                    size="icon"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="icon"
                disabled={productsData.current_page === productsData.last_page}
                onClick={() => handlePageChange(productsData.current_page + 1)}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {["name", "category", "description", "price"].map((field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={
                    field as keyof Omit<
                      Product,
                      "id" | "created_at" | "updated_at" | "deleted_at"
                    >
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {field.name[0].toUpperCase() + field.name.slice(1)}
                      </FormLabel>
                      <FormControl>
                        {field.name === "description" ? (
                          <Textarea {...field} />
                        ) : (
                          <Input
                            {...field}
                            type={field.name === "price" ? "number" : "text"}
                            step={field.name === "price" ? "0.01" : undefined}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
