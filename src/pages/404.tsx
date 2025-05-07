import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Custom404() {
  return <main className="flex flex-col gap-5 justify-center items-center h-screen">
    <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
    <Button asChild>
      <Link href={'/'}>Go to Home</Link>
    </Button>
  </main>;
}
