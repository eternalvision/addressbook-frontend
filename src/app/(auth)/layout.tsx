import { BookUser, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative grid min-h-screen overflow-hidden lg:grid-cols-[1.1fr_.9fr]">
      <section className="relative hidden min-h-screen border-r border-white/8 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/6">
            <BookUser className="size-5" />
          </div>
          <span className="font-semibold tracking-tight">AddressBook</span>
        </div>

        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Built for focused relationships
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em]">
            Your people,
            <br />
            without the noise.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
            A fast, private address book that keeps essential contact details
            clean and accessible.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4" />
          Contacts are scoped to your authenticated account
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
