"use client";

import type React from "react";

import { useState, useCallback, memo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FormFieldSchema, VSLFormSchema } from "./types";
import { validateField, validateForm } from "@/lib/vsl";

interface VSLFormModalProps {
  schema: VSLFormSchema;
  locale: string;
  onSubmit: (data: Record<string, string>) => void;
  onClose: () => void;
  isOpen: boolean;
}

// Memoized field component for performance
const FormField = memo(function FormField({
  field,
  value,
  error,
  locale,
  onChange,
  onBlur,
}: {
  field: FormFieldSchema;
  value: string;
  error?: string;
  locale: string;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
}) {
  const label = field.label[locale] || field.label.en || field.name;
  const placeholder =
    field.placeholder?.[locale] || field.placeholder?.en || "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(field.name, e.target.value);
    },
    [field.name, onChange],
  );

  const handleSelectChange = useCallback(
    (val: string) => {
      onChange(field.name, val);
    },
    [field.name, onChange],
  );

  const handleBlur = useCallback(() => {
    onBlur(field.name);
  }, [field.name, onBlur]);

  if (field.type === "checkbox") {
    return (
      <div className="flex items-start gap-3">
        <Checkbox
          id={field.name}
          checked={value === "true"}
          onCheckedChange={(checked) =>
            onChange(field.name, checked ? "true" : "")
          }
        />
        <Label
          htmlFor={field.name}
          className="text-sm leading-tight cursor-pointer"
        >
          {label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name}>
          {label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger
            id={field.name}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive",
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label[locale] || option.label.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={field.name}
        type={field.type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
        )}
        autoComplete={
          field.type === "email"
            ? "email"
            : field.type === "tel"
              ? "tel"
              : "off"
        }
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});

export function VSLFormModal({
  schema,
  locale,
  onSubmit,
  onClose,
  isOpen,
}: VSLFormModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return prev;
    });
  }, []);

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const field = schema.fields.find((f) => f.name === name);
      if (field) {
        const error = validateField(values[name] || "", field, locale);
        if (error) {
          setErrors((prev) => ({ ...prev, [name]: error }));
        }
      }
    },
    [schema.fields, values, locale],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const formErrors = validateForm(values, schema, locale);

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setTouched(
          schema.fields.reduce((acc, f) => ({ ...acc, [f.name]: true }), {}),
        );
        setIsSubmitting(false);
        return;
      }

      onSubmit(values);
      setIsSubmitting(false);
    },
    [values, schema, locale, onSubmit],
  );

  if (!isOpen) return null;

  const title = schema.title?.[locale] || schema.title?.en || "";
  const description =
    schema.description?.[locale] || schema.description?.en || "";
  const submitLabel = schema.submitLabel[locale] || schema.submitLabel.en;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vsl-form-title"
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {title && (
          <h2 id="vsl-form-title" className="text-2xl font-bold mb-2">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {schema.fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={values[field.name] || ""}
              error={touched[field.name] ? errors[field.name] : undefined}
              locale={locale}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </span>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
