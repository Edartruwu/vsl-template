"use client";

import { useState, useRef, lazy, Suspense } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Star,
  Shield,
  Clock,
  Quote,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { defaultLeadSchema } from "@/lib/vsl";
import { VSLProps } from "./types";

const VSLFormModal = lazy(() =>
  import("@/components/vsl/form").then((mod) => ({
    default: mod.VSLFormModal,
  })),
);

export function VSL({
  videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  videoPoster,
  badge,
  headline,
  subheadline,
  ctaText,
  ctaSubtext,
  onCtaClick,
  trustItems,
  testimonials,
  features,
  stats,
  urgencyText,
  formSchema = defaultLeadSchema,
  locale = "en",
  onFormSubmit,
  requireForm = true,
  className,
}: VSLProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(!requireForm);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (!isUnlocked && requireForm) {
      setShowForm(true);
      return;
    }
    togglePlay();
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setHasStarted(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    if (onFormSubmit) {
      await onFormSubmit(data);
    }
    setIsUnlocked(true);
    setShowForm(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setHasStarted(true);
        setIsPlaying(true);
      }
    }, 100);
  };

  return (
    <section className={cn("w-full", className)}>
      {/* Hero Section */}
      <div className="mx-auto max-w-4xl px-4 pt-12 md:pt-20">
        {badge && (
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-foreground">
              {badge}
            </span>
          </div>
        )}

        <h1 className="mb-4 text-balance text-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {headline}
        </h1>

        {subheadline && (
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-center text-lg text-muted-foreground md:text-xl">
            {subheadline}
          </p>
        )}

        {/* Video Player */}
        <div className="relative mb-10 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
          <div className="relative aspect-video">
            {videoPoster && (
              <img
                src={videoPoster || "/placeholder.svg"}
                alt=""
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-all duration-500",
                  hasStarted && "opacity-0",
                )}
                loading="eager"
                fetchPriority="high"
              />
            )}

            {isUnlocked && (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster={videoPoster}
                muted={isMuted}
                playsInline
                preload="metadata"
                onEnded={() => setIsPlaying(false)}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}

            {!videoPoster && !isUnlocked && (
              <div className="absolute inset-0 bg-linear-to-br from-muted to-muted/50" />
            )}

            {!hasStarted && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-foreground/20 backdrop-blur-[2px] transition-all hover:bg-foreground/30"
                aria-label={
                  isUnlocked ? "Play video" : "Enter details to watch"
                }
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110 md:h-24 md:w-24">
                  <Play
                    className="h-8 w-8 translate-x-0.5 md:h-10 md:w-10"
                    fill="currentColor"
                  />
                </div>
                {!isUnlocked && requireForm && (
                  <span className="rounded-full bg-background/95 px-5 py-2.5 text-sm font-medium text-foreground shadow-lg">
                    {locale === "es"
                      ? "Ingresa tus datos para ver"
                      : "Enter your details to watch"}
                  </span>
                )}
              </button>
            )}

            {hasStarted && (
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-linear-to-t from-foreground/80 to-transparent p-4">
                <button
                  onClick={togglePlay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-colors hover:bg-primary"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play
                      className="h-5 w-5 translate-x-0.5"
                      fill="currentColor"
                    />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-colors hover:bg-primary"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                <div className="text-2xl font-bold text-foreground md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Urgency */}
        {urgencyText && (
          <div className="mb-8 flex items-center justify-center gap-2 text-center">
            <Clock className="h-5 w-5 text-destructive" />
            <span className="font-medium text-destructive">{urgencyText}</span>
          </div>
        )}

        {/* CTA Section */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <Button
            size="lg"
            onClick={onCtaClick}
            className="h-14 px-12 text-lg font-semibold shadow-lg transition-transform hover:scale-105"
          >
            {ctaText}
          </Button>
          {ctaSubtext && (
            <span className="text-sm text-muted-foreground">{ctaSubtext}</span>
          )}
        </div>

        {/* Trust Items */}
        {trustItems && trustItems.length > 0 && (
          <div className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trustItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {features && features.length > 0 && (
        <div className="border-y border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
              {locale === "es"
                ? "Lo Que Vas a Descubrir"
                : "What You'll Discover"}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
                >
                  {feature.icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {testimonials && testimonials.length > 0 && (
        <div className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
              {locale === "es"
                ? "Historias de Éxito Reales"
                : "Real Success Stories"}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
              {locale === "es"
                ? "Personas comunes que están generando resultados extraordinarios"
                : "Ordinary people achieving extraordinary results"}
            </p>
            <div
              className={cn(
                "grid gap-6",
                testimonials.length === 1
                  ? "max-w-2xl mx-auto"
                  : testimonials.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
                >
                  <Quote className="h-8 w-8 text-primary/30" />
                  <p className="flex-1 text-foreground">{testimonial.quote}</p>

                  {/* Result highlight */}
                  {testimonial.result && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400">
                      <TrendingUp className="h-4 w-4" />
                      {testimonial.result}
                    </div>
                  )}

                  {/* Rating */}
                  {testimonial.rating && (
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < testimonial.rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted",
                          )}
                        />
                      ))}
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.author}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {testimonial.author}
                      </p>
                      {testimonial.role && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Verified badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>
                {locale === "es"
                  ? "Resultados Verificados"
                  : "Verified Results"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA       <div className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            {locale === "es" ? "¿Listo Para Empezar?" : "Ready to Get Started?"}
          </h2>
          <p className="mb-8 text-muted-foreground">
            {locale === "es"
              ? "Da el primer paso hacia tu libertad financiera"
              : "Take the first step towards your financial freedom"}
          </p>
          <Button
            size="lg"
            onClick={onCtaClick}
            className="h-14 px-12 text-lg font-semibold shadow-lg transition-transform hover:scale-105"
          >
            {ctaText}
          </Button>
        </div>
      </div> */}

      {showForm && (
        <Suspense fallback={null}>
          <VSLFormModal
            schema={formSchema}
            locale={locale}
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
          />
        </Suspense>
      )}
    </section>
  );
}
