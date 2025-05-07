// app/admin/users/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AppLayout from "@/layouts/app-layout";
import AdminLayout from "@/layouts/admin-layout";

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
  type: z.enum(["Admin", "Sales", "Finance"]),
});

type UserFormValues = z.infer<typeof userSchema>;


interface PageProps {
  data: UserFormValues[];
}

export default function AdminUsersPage({ users }: { users: PageProps }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormValues | null>(null);

  const router = useRouter();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      type: "Sales",
    },
  });

  useEffect(() => {
    if (isAddOpen) {
      form.reset({ name: "", email: "", type: "Sales" });
      setSelectedUser(null);
    }
  }, [isAddOpen]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      let response;
      if (selectedUser) {
        const updatedData = { ...data };
        if (!updatedData.password) {
          delete updatedData.password;
        }

        response = await fetch(`/api/users/${selectedUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
      } else {
        response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      if (response.ok) {
        setIsEditOpen(false);
        setIsAddOpen(false);
        setSelectedUser(null);
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user: UserFormValues) => {
    setSelectedUser(user);
    form.reset({
      type: user.type,
      name: user.name,
      email: user.email,
      password: "",
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setIsDeleteOpen(false);
        setSelectedUser(null);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const UserFormDialog = ({
    isOpen,
    onOpenChange,
    title,
  }: {
    isOpen: boolean;
    onOpenChange: (b: boolean) => void;
    title: string;
  }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
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
        <Button>Add User</Button>
      </DialogTrigger>
      <UserFormDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New User"
      />
    </Dialog>
  );

  return (
    <AppLayout breadcrumbs={[{ title: "Users", href: "/admin/users" }]}>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Manage Users</h1>
            <AddUserDialog />
          </div>

          <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        <Dialog
                          open={isDeleteOpen && selectedUser?.id === user.id}
                          onOpenChange={setIsDeleteOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete User</DialogTitle>
                            </DialogHeader>
                            <p>Are you sure you want to delete this user?</p>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsDeleteOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(user.id as number)}
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

        <UserFormDialog
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          title="Edit User"
        />
      </AdminLayout>
    </AppLayout>
  );
}

export async function getServerSideProps({ params }: any) {
  const users = await fetch(`http://localhost:3000/api/users`).then((res) =>
    res.json()
  );

  return {
    props: {
      users,
    },
  };
}
