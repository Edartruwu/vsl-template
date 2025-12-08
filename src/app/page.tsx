import { VSL } from "@/components/vsl";
import { VSLFormSchema } from "@/components/vsl/types";

export default function Home() {
  const customFormSchema: VSLFormSchema = {
    title: {
      es: "Agenda Tu Llamada Estratégica",
    },
    description: {
      es: "Ingresa tus datos para agendar una llamada uno a uno donde evaluaremos tu situación y te mostraremos si este camino es ideal para ti",
    },
    submitLabel: {
      es: "Agendar Mi Llamada Ahora",
    },
    fields: [
      {
        name: "firstName",
        type: "text",
        label: { es: "Nombre" },
        placeholder: { es: "Tu nombre" },
        required: true,
        validation: { minLength: 2 },
      },
      {
        name: "email",
        type: "email",
        label: { es: "Correo Electrónico" },
        placeholder: { es: "tu@ejemplo.com" },
        required: true,
      },
      {
        name: "phone",
        type: "tel",
        label: { es: "Teléfono" },
        placeholder: { es: "+34 600 000 000" },
        required: true,
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <VSL
        badge="Cultura de Relojes"
        headline="Un Reloj Puede Pagarte Todos Los Meses"
        subheadline="Descubre cómo personas comunes están aprendiendo a usar relojes de lujo como activos y generando ingresos adicionales. No necesitas ser millonario. Solo necesitas aprender a jugar bien este juego."
        videoUrl="https://aiwtbhauow.ufs.sh/f/ZbekQqR5Eb12l1ix8b7HfXmRnoGUPELv5FIy7J6kNZO3abB4"
        ctaText="Agendar Mi Llamada Estratégica"
        ctaSubtext="Habla con Anthony o su equipo en una llamada uno a uno"
        urgencyText="Plazas limitadas — No dejes pasar esta oportunidad"
        stats={[
          { value: "+227%", label: "ROI Promedio" },
          { value: "48 Horas", label: "Venta Más Rápida" },
          { value: "$1,150", label: "Ganancia en 1 Semana" },
          { value: "100%", label: "Casos Reales" },
        ]}
        trustItems={[
          "Comunidad privada exclusiva",
          "Casos reales documentados",
          "Entrenamiento completo",
          "Acompañamiento personalizado",
          "Guías prácticas y plantillas",
          "Actualizaciones constantes",
        ]}
        socialProof={{
          text: '"Compré un Rolex Zombie por $19,600 en un AD y lo vendí 48 horas después por $21,000 en nuestro dealer chat." — Mateo Salmón Kaemena',
          rating: 5,
        }}
        requireForm={true}
        formSchema={customFormSchema}
        locale="es"
      />
    </main>
  );
}
