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
    DialogDescription,
    DialogFooter,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import AppLayout from "../../layouts/app-layout";
import { BreadcrumbItem } from "../../types";
import { ChevronLeftIcon, ChevronRightIcon, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import useSWR from 'swr';
import { fetcher, swrConfig } from '@/lib/swr';

const inquirySchema = z.object({
    id: z.number().optional(),
    messageId: z.string().optional(),
    senderEmail: z.string().email("Invalid email"),
    senderName: z.string().min(1, "Sender name is required"),
    companyName: z.string().optional(),
    mobileNumber: z.string().optional(),
    emailSubject: z.string().min(1, "Subject is required"),
    emailSummary: z.string().optional(),
    extractedJson: z.string().optional(),
    emailRaw: z.string().optional(),
    emailDate: z.string().optional().nullable(),
    inquiryType: z.string().optional(),
    isInquiry: z.number().min(0).max(1).optional(),
    assignedTo: z.number().optional().nullable(),
});

type Inquiry = z.infer<typeof inquirySchema>;

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
    inquiries: PaginatedData<Inquiry>;
    users: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Inquiries",
        href: "/inquiries",
    },
];

export default function Inquiries() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);
    const { data: session } = useSession();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data: inquiriesData, error: inquiriesError, mutate: mutateInquiries } = useSWR<PaginatedData<Inquiry>>(
        `/api/inquiries?page=${page}`,
        fetcher,
        swrConfig
    );
    const { data: usersData, error: usersError } = useSWR<{ data: { id: number; name: string }[] }>(
        `/api/users`,
        fetcher,
        swrConfig
    );

    const inquiries = inquiriesData || { data: [], current_page: 1, last_page: 1, total: 0, from: 0, to: 0 };
    const users = usersData?.data || [];

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<Inquiry>({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            assignedTo: undefined,
            emailSummary: '',
        },
    });

    const onSubmit = async (data: Inquiry) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/inquiries/${selectedInquiry?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setIsEditOpen(false);
                setSelectedInquiry(null);
                form.reset();
                mutateInquiries();
            }
        } catch (error) {
            console.error("Error updating inquiry:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        form.reset({
            assignedTo: inquiry.assignedTo,
            emailSummary: inquiry.emailSummary || '',
        });
        setIsEditOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedInquiry?.id) return;
        try {
            setIsLoading(true);
            const response = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setIsDeleteOpen(false);
                setSelectedInquiry(null);
                mutateInquiries();
            }
        } catch (error) {
            console.error("Error deleting inquiry:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/inquiries?page=${newPage}`);
    };

    const getAssignedUserName = (userId: number | undefined) => {
        const user = users.find((u: { id: number; name: string }) => u.id === userId);
        return user ? user.name : "Unknown User";
    };

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            const response = await fetch(`/api/mails/latest`, {
                method: 'POST',
            });
            if (response.ok) {
                mutateInquiries();
            }
        } catch (error) {
            console.error("Error refreshing inquiries:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    if (inquiriesError || usersError) {
        return <div>Error loading data</div>;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs} cta={session?.user?.type === "Admin" && (
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                >
                    {isRefreshing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh Inquiries
                        </>
                    )}
                </Button>
        )}>
            <div className="mx-auto w-full max-w-7xl p-2 sm:p-6 lg:p-8">
                <div className="rounded-lg border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="max-w-52">Subject</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.data.map((inquiry) => (
                                <TableRow key={inquiry.id}>
                                    <TableCell className="font-medium">{inquiry.senderName}</TableCell>
                                    <TableCell>{inquiry.senderEmail}</TableCell>
                                    <TableCell className="max-w-52 truncate" title={inquiry.emailSubject || ''}>
                                        {inquiry.emailSubject}
                                    </TableCell>
                                    <TableCell>{inquiry.companyName || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={inquiry.assignedTo ? "default" : "secondary"}>
                                            {getAssignedUserName(inquiry.assignedTo as number)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(inquiry)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedInquiry(inquiry);
                                                setIsDeleteOpen(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {inquiries.last_page > 1 && (
                    <div className="flex items-center justify-between border-t px-4 py-3">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{inquiries.from}</span> to{" "}
                                <span className="font-medium">{inquiries.to}</span> of{" "}
                                <span className="font-medium">{inquiries.total}</span> results
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={inquiries.current_page === 1}
                                onClick={() => handlePageChange(inquiries.current_page - 1)}
                            >
                                <ChevronLeftIcon />
                            </Button>
                            {Array.from({ length: inquiries.last_page }, (_, i) => i + 1).map(
                                (page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            page === inquiries.current_page ? "default" : "outline"
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
                                disabled={inquiries.current_page === inquiries.last_page}
                                onClick={() => handlePageChange(inquiries.current_page + 1)}
                            >
                                <ChevronRightIcon />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Inquiry</DialogTitle>
                        <DialogDescription>
                            Update the inquiry details below.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="assignedTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assigned To</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select user" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="not-assigned" disabled={true}>Not Assigned</SelectItem>
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="emailSummary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Summary</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Inquiry</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this inquiry? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
