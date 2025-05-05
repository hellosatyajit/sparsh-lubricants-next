'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '../../components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Textarea } from '../../components/ui/textarea';
import AppLayout from '../../layouts/app-layout';
import { Product, productFormSchema } from '../../lib/schema';
import { BreadcrumbItem } from '../../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Products',
    href: '/products',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<PaginatedData<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async (page = 1) => {
    const res = await fetch(`/api/products?page=${page}`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      price: 0,
    },
  });

  useEffect(() => {
    if (isAddOpen) {
      form.reset({
        name: '',
        category: '',
        description: '',
        price: 0,
      });
      setSelectedProduct(null);
    }
  }, [isAddOpen]);

  const onSubmit = async (data: any) => {
    const url = selectedProduct ? `/api/products/${selectedProduct.id}` : '/api/products';
    const method = selectedProduct ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      if (selectedProduct) {
        setIsEditOpen(false);
      } else {
        setIsAddOpen(false);
      }
      form.reset();
      fetchProducts(currentPage);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    form.reset(product);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setIsDeleteOpen(false);
      setSelectedProduct(null);
      fetchProducts(currentPage);
    }
  };

  const AddProductDialog = () => (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form Fields same as before */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  if (!products) return <div>Loading...</div>;

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
              {products.data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pl-4">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="max-w-52 truncate" title={product.description || ''}>
                    {product.description}
                  </TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        Edit
                      </Button>
                      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm" onClick={() => setSelectedProduct(product)}>
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Product</DialogTitle>
                          </DialogHeader>
                          <p>Are you sure you want to delete this product?</p>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(product.id!)}>Delete</Button>
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
        {/* Pagination */}
        {products.last_page > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{products.from}</span> to <span className="font-medium">{products.to}</span> of <span className="font-medium">{products.total}</span> results
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  <ChevronLeftIcon />
                </Button>
                {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                  <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="icon" onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="icon" disabled={currentPage === products.last_page} onClick={() => setCurrentPage((p) => p + 1)}>
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
