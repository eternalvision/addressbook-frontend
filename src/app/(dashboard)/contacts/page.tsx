"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  BookUser,
  CircleAlert,
  LogOut,
  Plus,
  Search,
  Server,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { ContactCard } from "@/components/contact-card";
import { ContactDialog } from "@/components/contact-dialog";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import type { Contact } from "@/lib/types";

const contactsCollection =
  process.env.NEXT_PUBLIC_FIREBASE_CONTACTS_COLLECTION ?? "contacts";
const ownerField =
  process.env.NEXT_PUBLIC_FIREBASE_OWNER_FIELD ?? "userId";

export default function ContactsPage() {
  const router = useRouter();
  const { session, status, logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/login");
    }
  }, [router, status]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const contactsQuery = query(
      collection(db, contactsCollection),
      where(ownerField, "==", session.user.id),
    );

    const unsubscribe = onSnapshot(
      contactsQuery,
      (snapshot) => {
        const nextContacts = snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<Contact, "id">),
        }));

        setContacts(
          nextContacts.sort((a, b) =>
            `${a.firstName} ${a.lastName}`.localeCompare(
              `${b.firstName} ${b.lastName}`,
            ),
          ),
        );
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        toast.error(error.message || "Unable to read contacts from Firestore");
      },
    );

    return unsubscribe;
  }, [session]);

  const visibleContacts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return contacts;
    }

    return contacts.filter((contact) =>
      [
        contact.firstName,
        contact.lastName,
        contact.phone,
        contact.address,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [contacts, search]);

  if (status === "loading" || !session) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl p-6 sm:p-8">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="mt-10 h-40 w-full rounded-3xl" />
      </main>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-5 sm:px-8 sm:py-7">
      <header className="glass sticky top-4 z-20 flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/6">
            <BookUser className="size-5" />
          </div>
          <div>
            <p className="font-semibold leading-none">AddressBook</p>
            <p className="mt-1.5 hidden text-xs text-muted-foreground sm:block">
              {session.user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/8 px-3 py-1.5 text-xs text-emerald-300 md:flex">
            <Server className="size-3.5" />
            Firestore connected
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Your network</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            People worth keeping close.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Keep the details that matter, find anyone quickly, and leave the
            rest of the clutter somewhere else.
          </p>
        </div>

        <Button size="lg" onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          New contact
        </Button>
      </section>

      <section className="mt-10 rounded-3xl border border-white/10 bg-card/55 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contacts"
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
          </p>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : visibleContacts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={() => setEditingContact(contact)}
                />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <EmptyState
              icon={UserRound}
              title="No contacts yet"
              description="Create your first contact and it will appear here in real time."
              actionLabel="Create contact"
              onAction={() => setIsCreateOpen(true)}
            />
          ) : (
            <EmptyState
              icon={CircleAlert}
              title="No matching contacts"
              description="Try a different name, phone number, or address."
            />
          )}
        </div>
      </section>

      <ContactDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
      />

      <ContactDialog
        open={Boolean(editingContact)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingContact(null);
          }
        }}
        mode="edit"
        contact={editingContact ?? undefined}
      />
    </main>
  );
}
