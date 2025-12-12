"use client";
import { VSL } from "@/components/vsl";
import { VSLFormSchema } from "@/components/vsl/types";
import { createLead, CreateLeadInput } from "@/lib/createLead";

const culturaRelojesFormSchema: VSLFormSchema = {
  title: {
    es: "Accede al Entrenamiento Exclusivo",
    en: "Access the Exclusive Training",
  },
  description: {
    es: "Ingresa tus datos para descubrir cómo convertir relojes de lujo en activos rentables",
    en: "Enter your details to discover how to turn luxury watches into profitable assets",
  },
  submitLabel: {
    es: "Ver Video Ahora",
    en: "Watch Video Now",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: { es: "Nombre", en: "First Name" },
      placeholder: { es: "Tu nombre", en: "Your name" },
      required: true,
      validation: { minLength: 2 },
    },
    {
      name: "email",
      type: "email",
      label: { es: "Correo Electrónico", en: "Email Address" },
      placeholder: { es: "tu@correo.com", en: "you@email.com" },
      required: true,
    },
    {
      name: "phone",
      type: "tel",
      label: { es: "WhatsApp", en: "WhatsApp" },
      placeholder: { es: "+52 55 1234 5678", en: "+1 555 123 4567" },
      required: true,
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <VSL
        badge="Masterclass Exclusiva"
        headline="La habilidad de lujo que genera $3K–$5K por operación con relojes (en 90 días)"
        subheadline="Descubre el método que personas comunes están usando para generar ingresos con relojes de lujo — sin ser millonario, sin contactos, solo estrategia."
        videoPoster="/anthony.gif"
        videoUrl="https://aiwtbhauow.ufs.sh/f/ZbekQqR5Eb12l1ix8b7HfXmRnoGUPELv5FIy7J6kNZO3abB4"
        ctaText="Agenda Tu Llamada Ahora"
        ctaSubtext="Evaluación gratuita de 15 minutos con nuestro equipo"
        urgencyText="Cupos limitados — Solo aceptamos 10 nuevos miembros por semana"
        trustItems={[
          "Comunidad Privada de Inversionistas",
          "Acompañamiento Personalizado",
          "Guías y Plantillas Incluidas",
        ]}
        requireForm={true}
        formSchema={culturaRelojesFormSchema}
        locale="es"
        onFormSubmit={async (data: CreateLeadInput) => {
          await createLead({
            email: data.email,
            name: data.name,
            phone: data.phone,
          });
        }}
        onCtaClick={() => {
          window.open(
            "https://calendly.com/anthonypezer/consultoria",
            "_blank",
          );
        }}
      />
    </main>
  );
}
