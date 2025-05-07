import { useRouter } from "next/navigation";

export default function Admin() {
    const router = useRouter();
    router.push("/admin/users");
    return null;
}