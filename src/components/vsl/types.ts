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

export interface VSLTestimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  result?: string;
  rating?: number;
}

export interface VSLFeature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface VSLProps {
  // Video
  videoUrl?: string;
  videoPoster?: string;

  // Content
  badge?: string;
  headline: string;
  subheadline?: string;

  // CTA
  ctaText: string;
  ctaSubtext?: string;
  onCtaClick?: () => void;

  // Trust elements
  trustItems?: string[];

  testimonials?: VSLTestimonial[];

  features?: VSLFeature[];

  // Stats
  stats?: Array<{
    value: string;
    label: string;
  }>;

  // Urgency
  urgencyText?: string;

  // Form gating
  formSchema?: VSLFormSchema;
  locale?: string;
  onFormSubmit?: (data: Record<string, string>) => void | Promise<void>;
  requireForm?: boolean;

  // Styling
  className?: string;
}
