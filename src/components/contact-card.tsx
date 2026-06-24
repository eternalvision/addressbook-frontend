import { MapPin, MoreHorizontal, Pencil, Phone, UserRound } from "lucide-react";
import type { Contact } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ContactCardProps = {
  contact: Contact;
  onEdit: () => void;
};

export function ContactCard({ contact, onEdit }: ContactCardProps) {
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/45 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-background/65">
      <div className="flex items-start justify-between gap-4">
        <Avatar className="size-12 border border-white/10">
          <AvatarFallback className="bg-primary/12 font-medium text-primary">
            {initials.toUpperCase() || <UserRound className="size-4" />}
          </AvatarFallback>
        </Avatar>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${fullName}`}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4" />
              Edit contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h2 className="mt-5 truncate text-lg font-semibold tracking-tight">
        {fullName}
      </h2>

      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        <a
          href={`tel:${contact.phone}`}
          className="flex items-center gap-3 transition hover:text-foreground"
        >
          <Phone className="size-4 shrink-0 text-primary" />
          <span className="truncate">{contact.phone}</span>
        </a>
        <p className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="line-clamp-2 leading-5">{contact.address}</span>
        </p>
      </div>
    </article>
  );
}
