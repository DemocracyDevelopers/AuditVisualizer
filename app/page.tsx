import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/upload");
  return (
    <main>
      <div>test</div>
      <Link href="/new-page">
        <Button variant="link" className="hover:text-blue-600">
          click here: new page
        </Button>
      </Link>
    </main>
  );
}
