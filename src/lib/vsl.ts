"use client";
import { FormFieldSchema, VSLFormSchema } from "@/components/vsl/types";

const errorMessages: Record<string, Record<string, string>> = {
  en: {
    required: "{field} is required",
    email: "Please enter a valid email address",
    minLength: "{field} must be at least {min} characters",
    maxLength: "{field} must be no more than {max} characters",
    pattern: "Please enter a valid {field}",
    min: "{field} must be at least {min}",
    max: "{field} must be no more than {max}",
    tel: "Please enter a valid phone number",
  },
  es: {
    required: "{field} es obligatorio",
    email: "Por favor, introduce un correo electrónico válido",
    minLength: "{field} debe tener al menos {min} caracteres",
    maxLength: "{field} debe tener como máximo {max} caracteres",
    pattern: "Por favor, introduce un {field} válido",
    min: "{field} debe ser al menos {min}",
    max: "{field} debe ser como máximo {max}",
    tel: "Por favor, introduce un número de teléfono válido",
  },
  fr: {
    required: "{field} est requis",
    email: "Veuillez entrer une adresse email valide",
    minLength: "{field} doit contenir au moins {min} caractères",
    maxLength: "{field} ne doit pas dépasser {max} caractères",
    pattern: "Veuillez entrer un {field} valide",
    min: "{field} doit être au moins {min}",
    max: "{field} ne doit pas dépasser {max}",
    tel: "Veuillez entrer un numéro de téléphone valide",
  },
  de: {
    required: "{field} ist erforderlich",
    email: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    minLength: "{field} muss mindestens {min} Zeichen lang sein",
    maxLength: "{field} darf maximal {max} Zeichen lang sein",
    pattern: "Bitte geben Sie ein gültiges {field} ein",
    min: "{field} muss mindestens {min} sein",
    max: "{field} darf höchstens {max} sein",
    tel: "Bitte geben Sie eine gültige Telefonnummer ein",
  },
  pt: {
    required: "{field} é obrigatório",
    email: "Por favor, insira um endereço de email válido",
    minLength: "{field} deve ter pelo menos {min} caracteres",
    maxLength: "{field} deve ter no máximo {max} caracteres",
    pattern: "Por favor, insira um {field} válido",
    min: "{field} deve ser pelo menos {min}",
    max: "{field} deve ser no máximo {max}",
    tel: "Por favor, insira um número de telefone válido",
  },
};

// Get error messages for a locale (falls back to English)
export function getErrorMessages(locale: string): Record<string, string> {
  return errorMessages[locale] || errorMessages.en;
}

// Generate error message with interpolation
export function generateError(
  template: string,
  field: string,
  params?: Record<string, string | number>,
): string {
  let message = template.replace("{field}", field);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, String(value));
    });
  }
  return message;
}

// Validate a single field
export function validateField(
  value: string,
  field: FormFieldSchema,
  locale: string,
): string | null {
  const messages = getErrorMessages(locale);
  const fieldLabel = field.label[locale] || field.label.en || field.name;

  // Required check
  if (field.required && (!value || value.trim() === "")) {
    return generateError(messages.required, fieldLabel);
  }

  if (!value) return null;

  // Email validation
  if (field.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return messages.email;
    }
  }

  // Phone validation
  if (field.type === "tel") {
    const telRegex = /^[\d\s\-+()]{7,}$/;
    if (!telRegex.test(value)) {
      return messages.tel;
    }
  }

  // Validation rules
  if (field.validation) {
    const { minLength, maxLength, pattern, min, max } = field.validation;

    if (minLength && value.length < minLength) {
      return generateError(messages.minLength, fieldLabel, { min: minLength });
    }

    if (maxLength && value.length > maxLength) {
      return generateError(messages.maxLength, fieldLabel, { max: maxLength });
    }

    if (pattern && !new RegExp(pattern).test(value)) {
      return generateError(messages.pattern, fieldLabel);
    }

    if (field.type === "number") {
      const numValue = Number.parseFloat(value);
      if (min !== undefined && numValue < min) {
        return generateError(messages.min, fieldLabel, { min });
      }
      if (max !== undefined && numValue > max) {
        return generateError(messages.max, fieldLabel, { max });
      }
    }
  }

  return null;
}

// Validate entire form
export function validateForm(
  values: Record<string, string>,
  schema: VSLFormSchema,
  locale: string,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of schema.fields) {
    const error = validateField(values[field.name] || "", field, locale);
    if (error) {
      errors[field.name] = error;
    }
  }

  return errors;
}

// Default schema for lead capture
export const defaultLeadSchema: VSLFormSchema = {
  title: {
    en: "Get Instant Access",
    es: "Obtén Acceso Instantáneo",
    fr: "Accès Instantané",
    de: "Sofortiger Zugang",
    pt: "Acesso Instantâneo",
  },
  description: {
    en: "Enter your details to watch the free training",
    es: "Ingresa tus datos para ver el entrenamiento gratuito",
    fr: "Entrez vos coordonnées pour voir la formation gratuite",
    de: "Geben Sie Ihre Daten ein, um das kostenlose Training anzusehen",
    pt: "Digite seus dados para assistir ao treinamento gratuito",
  },
  submitLabel: {
    en: "Watch Now",
    es: "Ver Ahora",
    fr: "Regarder Maintenant",
    de: "Jetzt Ansehen",
    pt: "Assistir Agora",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: {
        en: "Full Name",
        es: "Nombre Completo",
        fr: "Nom Complet",
        de: "Vollständiger Name",
        pt: "Nome Completo",
      },
      placeholder: {
        en: "John Doe",
        es: "Juan Pérez",
        fr: "Jean Dupont",
        de: "Max Mustermann",
        pt: "João Silva",
      },
      required: true,
      validation: { minLength: 2, maxLength: 100 },
    },
    {
      name: "email",
      type: "email",
      label: {
        en: "Email Address",
        es: "Correo Electrónico",
        fr: "Adresse Email",
        de: "E-Mail-Adresse",
        pt: "Endereço de Email",
      },
      placeholder: {
        en: "you@example.com",
        es: "tu@ejemplo.com",
        fr: "vous@exemple.com",
        de: "du@beispiel.de",
        pt: "voce@exemplo.com",
      },
      required: true,
    },
  ],
};
