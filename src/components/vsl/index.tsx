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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VSLFormSchema } from "./types";
import { defaultLeadSchema } from "@/lib/vsl";

const VSLFormModal = lazy(() =>
  import("@/components/vsl/form").then((mod) => ({
    default: mod.VSLFormModal,
  })),
);

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
  socialProof?: {
    text: string;
    rating?: number;
  };

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
  socialProof,
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
    // Auto-play after form submission
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
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Badge */}
        {badge && (
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-foreground">
              {badge}
            </span>
          </div>
        )}

        {/* Headline */}
        <h1 className="mb-4 text-balance text-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {headline}
        </h1>

        {/* Subheadline */}
        {subheadline && (
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-center text-lg text-muted-foreground md:text-xl">
            {subheadline}
          </p>
        )}

        {/* Video Player */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-card shadow-2xl">
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={videoPoster || "/placeholder.svg?height=720&width=1280"}
              muted={isMuted}
              playsInline
              preload="metadata"
              onEnded={() => setIsPlaying(false)}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Play Overlay - now triggers form if locked */}
            {!hasStarted && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center bg-foreground/10 transition-colors hover:bg-foreground/20"
                aria-label={
                  isUnlocked ? "Play video" : "Enter details to watch"
                }
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                  <Play
                    className="h-8 w-8 translate-x-0.5"
                    fill="currentColor"
                  />
                </div>
              </button>
            )}

            {/* Video Controls */}
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
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-4 text-center"
              >
                <div className="text-2xl font-bold md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Urgency */}
        {urgencyText && (
          <div className="mb-6 flex items-center justify-center gap-2 text-center">
            <Clock className="h-5 w-5 text-destructive" />
            <span className="font-medium text-destructive">{urgencyText}</span>
          </div>
        )}

        {/* CTA Section */}
        <div className="mb-8 flex flex-col items-center gap-3">
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
          <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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

        {/* Social Proof */}
        {socialProof && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-6">
            {socialProof.rating && (
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < socialProof.rating!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted",
                    )}
                  />
                ))}
              </div>
            )}
            <p className="text-center text-muted-foreground">
              {socialProof.text}
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Verified Reviews</span>
            </div>
          </div>
        )}
      </div>

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
