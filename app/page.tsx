import TestComponent1 from "@/components/test-component-1";
import TestComponents2 from "@/components/test-component-2";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/upload");
  return (
    <main>
      <div>test</div>
      <TestComponent1 />
      <TestComponents2 />
      <Link href="/new-page">
        <Button variant="link" className="hover:text-blue-600">
          click here: new page
        </Button>
      </Link>
    </main>
  );
}
