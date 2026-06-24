"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import type { Contact, ContactInput } from "@/lib/types";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  address: z.string().trim().min(3, "Address is required").max(240),
});

type ContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  contact?: Contact;
};

const emptyValues: ContactInput = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
};

export function ContactDialog({
  open,
  onOpenChange,
  mode,
  contact,
}: ContactDialogProps) {
  const { session, logout } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      contact
        ? {
            firstName: contact.firstName,
            lastName: contact.lastName,
            phone: contact.phone,
            address: contact.address,
          }
        : emptyValues,
    );
  }, [contact, open, reset]);

  const onSubmit = async (values: ContactInput) => {
    if (!session) {
      return;
    }

    try {
      if (mode === "create") {
        await apiRequest("/contacts", {
          method: "POST",
          token: session.token,
          body: values,
        });
        toast.success("Contact created");
      } else if (contact) {
        await apiRequest(`/contacts/${contact.id}`, {
          method: "PATCH",
          token: session.token,
          body: values,
        });
        toast.success("Contact updated");
      }

      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save contact";

      if (message.toLowerCase().includes("authentication")) {
        await logout();
      }

      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create contact" : "Edit contact"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add the essential details for this person."
              : "Update only the information that changed."}
          </DialogDescription>
        </DialogHeader>

        <form id="contact-form" className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="firstName"
              label="First name"
              placeholder="John"
              error={errors.firstName?.message}
              inputProps={register("firstName")}
            />
            <Field
              id="lastName"
              label="Last name"
              placeholder="Doe"
              error={errors.lastName?.message}
              inputProps={register("lastName")}
            />
          </div>

          <Field
            id="phone"
            label="Phone"
            placeholder="+420 123 456 789"
            error={errors.phone?.message}
            inputProps={register("phone")}
          />

          <Field
            id="address"
            label="Address"
            placeholder="123 Main St, Prague"
            error={errors.address?.message}
            inputProps={register("address")}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button form="contact-form" type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
            {mode === "create" ? "Create contact" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
};

function Field({
  id,
  label,
  placeholder,
  error,
  inputProps,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
