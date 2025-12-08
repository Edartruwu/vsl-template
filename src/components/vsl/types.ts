export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "select"
  | "checkbox";

export interface FormFieldSchema {
  name: string;
  type: FieldType;
  label: Record<string, string>; // keyed by locale
  placeholder?: Record<string, string>;
  required?: boolean;
  options?: Array<{ value: string; label: Record<string, string> }>; // for select
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string; // regex pattern
    min?: number;
    max?: number;
  };
}

export interface VSLFormSchema {
  fields: FormFieldSchema[];
  submitLabel: Record<string, string>;
  title?: Record<string, string>;
  description?: Record<string, string>;
}
