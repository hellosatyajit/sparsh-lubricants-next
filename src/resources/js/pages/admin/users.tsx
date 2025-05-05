import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '../../types';
import { useEffect, useState } from 'react';

import HeadingSmall from '../../components/heading-small';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminLayout from '../../layouts/admin-layout';
import AppLayout from '../../layouts/app-layout';
import { MailAccount, mailAccountFormSchema } from '../../lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mail Accounts',
        href: '/admin/mail-accounts',
    },
];

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
    mailAccounts: PaginatedData<MailAccount>;
}

export default function MailAccounts({ mailAccounts }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<MailAccount | null>(null);

    const form = useForm<{
        mail_id: string;
        status: string;
        app_code: string;
    }>({
        resolver: zodResolver(mailAccountFormSchema),
        defaultValues: {
            mail_id: '',
            status: '',
            app_code: '',
        },
    });

    useEffect(() => {
        if (isAddOpen) {
            form.setValue('mail_id', '');
            form.setValue('status', 'active');
            form.setValue('app_code', '');
            setSelectedAccount(null);
        }
    }, [isAddOpen]);

    const onSubmit = async (data: any) => {
        if (selectedAccount) {
            await router.put(`/admin/mail-accounts/${selectedAccount.id}`, data, {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedAccount(null);
                    form.reset();
                },
            });
        } else {
            await router.post('/admin/mail-accounts', data, {
                onSuccess: () => {
                    setIsAddOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleEdit = (account: MailAccount) => {
        setSelectedAccount(account);
        form.reset({
            mail_id: account.mail_id,
            status: account.status,
            app_code: account.app_code,
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: number) => {
        await router.delete(`/admin/mail-accounts/${id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedAccount(null);
            },
        });
    };

    const handleModalState = (type: 'add' | 'edit' | 'delete', account: MailAccount | null = null) => {
        if (type === 'add') {
            setIsAddOpen(true);
            form.reset();
        } else if (type === 'edit' && account) {
            setSelectedAccount(account);
            form.reset({
                mail_id: account.mail_id,
                status: account.status,
                app_code: account.app_code,
            });
            setIsEditOpen(true);
        } else if (type === 'delete' && account) {
            setSelectedAccount(account);
            setIsDeleteOpen(true);
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
                            name="mail_id"
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
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="app_code"
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mail Accounts" />

            <AdminLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Mail Accounts" description="Manage mail accounts" cta={<AddUserDialog />} />

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
                                {mailAccounts.data.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell className="pl-4">{account.mail_id}</TableCell>
                                        <TableCell>{account.status}</TableCell>
                                        <TableCell className="capitalize">{account.app_code}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleModalState('edit', account)}>
                                                    Edit
                                                </Button>
                                                <Dialog open={isDeleteOpen && selectedAccount?.id === account.id} onOpenChange={setIsDeleteOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => handleModalState('delete', account)}>
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
                        {mailAccounts.last_page > 1 && (
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={mailAccounts.current_page === 1}
                                    onClick={() => router.get(`/admin/mail-accounts?page=${mailAccounts.current_page - 1}`)}
                                >
                                    <ChevronLeftIcon />
                                </Button>
                                {Array.from({ length: mailAccounts.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === mailAccounts.current_page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => router.get(`/admin/mail-accounts?page=${page}`)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={mailAccounts.current_page === mailAccounts.last_page}
                                    onClick={() => router.get(`/admin/mail-accounts?page=${mailAccounts.current_page + 1}`)}
                                >
                                    <ChevronRightIcon />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <UserFormDialog isOpen={isEditOpen} onOpenChange={setIsEditOpen} title="Edit Account" />
            </AdminLayout>
        </AppLayout>
    );
}
