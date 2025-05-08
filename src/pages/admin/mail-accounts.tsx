"use client";

import { useRouter } from 'next/navigation';
import { type BreadcrumbItem } from '../../types';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminLayout from '../../layouts/admin-layout';
import AppLayout from '../../layouts/app-layout';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { z } from 'zod';

export const mailAccountSchema = z.object({
    id: z.number().optional(),
    email: z.string().min(1, 'Mail ID is required'),
    status: z.enum(['Active', 'Inactive']),
    appCode: z.string().min(8, 'App Code is required'),
});

export type MailAccount = z.infer<typeof mailAccountSchema>;

interface PageProps {
    mailAccounts: MailAccount[];
}


export default function MailAccounts({ mailAccounts }: PageProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<MailAccount | null>(null);
    const router = useRouter();

    const form = useForm<MailAccount>({
        resolver: zodResolver(mailAccountSchema),
        defaultValues: {
            email: '',
            status: 'Active',
            appCode: '',
        },
    });

    console.log(form.formState.errors);


    useEffect(() => {
        if (isAddOpen) {
            form.reset({ email: '', status: 'Active', appCode: '' });
            setSelectedAccount(null);
        }
    }, [isAddOpen]);

    const onSubmit = async (data: any) => {
        try {
            let response;
            if (selectedAccount) {
                response = await fetch(`/api/mail-accounts/${selectedAccount.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            } else {
                response = await fetch('/api/mail-accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            }
            if (response.ok) {
                setIsEditOpen(false);
                setSelectedAccount(null);
                setIsAddOpen(false);
                form.reset();
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (account: MailAccount) => {
        setSelectedAccount(account);
        form.reset({
            email: account.email,
            status: account.status,
            appCode: account.appCode,
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/mail-accounts/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setIsDeleteOpen(false);
                setSelectedAccount(null);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const UserFormDialog = ({ isOpen, onOpenChange, title }: { isOpen: boolean; onOpenChange: (open: boolean) => void; title: string }) => (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mail ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="appCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>App Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );

    const AddUserDialog = () => (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
                <Button>Add Mail Account</Button>
            </DialogTrigger>
            <UserFormDialog isOpen={isAddOpen} onOpenChange={setIsAddOpen} title="Add New Mail Account" />
        </Dialog>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Mail Accounts', href: '/admin/mail-accounts' }]}>
            <AdminLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-semibold">Manage Mail Accounts</h1>
                        <AddUserDialog />
                    </div>

                    <div className="overflow-hidden rounded-lg border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Mail ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>App Code</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mailAccounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell className="pl-4">{account.email}</TableCell>
                                        <TableCell>{account.status}</TableCell>
                                        <TableCell>{account.appCode}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(account)}>
                                                    Edit
                                                </Button>
                                                <Dialog open={isDeleteOpen && selectedAccount?.id === account.id} onOpenChange={setIsDeleteOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedAccount(account);
                                                                setIsDeleteOpen(true);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete Account</DialogTitle>
                                                        </DialogHeader>
                                                        <p>Are you sure you want to delete this account?</p>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button variant="destructive" onClick={() => handleDelete(account.id ?? 0)}>
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

                <UserFormDialog isOpen={isEditOpen} onOpenChange={setIsEditOpen} title="Edit Account" />
            </AdminLayout>
        </AppLayout>
    );
}

export async function getServerSideProps({ query }: any) {
    const page = query.page || 1;
    const mailAccounts = await fetch(`http://localhost:3000/api/mail-accounts?page=${page}`).then((res) => res.json());

    return {
        props: {
            mailAccounts,
        },
    };
}
