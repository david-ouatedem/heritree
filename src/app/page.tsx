import Link from "next/link";
import { TreePine } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-3">
        <TreePine className="h-12 w-12 text-green-600" />
        <h1 className="text-4xl font-bold">Heritree</h1>
      </div>
      <p className="max-w-md text-center text-lg text-gray-600">
        Build, visualize, and explore your family history through an interactive
        tree interface.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-50"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
