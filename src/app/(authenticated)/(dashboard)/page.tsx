import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import Workspace from "../../components/workspace";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return redirect("/signin");
  }

  return <div className="min-h-screen bg-background">

    <div className="p-4">
      <div className="mb-8">
        <Workspace />
      </div>

      <Link href="#" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        View workspace
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  </div>;
}
