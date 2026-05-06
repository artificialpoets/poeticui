/**
 * ServiceIcon — single entry point for rendering a service mark.
 *
 * Resolution order:
 *   1. simple-icons brand SVG (3,200+ brands; tree-shakable named imports)
 *   2. Lucide category icon tinted to a brand hex — for brands trademark-
 *      blocked from simple-icons (AWS, OpenAI, Acast, MUX, LinkedIn, Slack,
 *      Salesforce, Azure)
 *   3. Lucide category icon for generic infra terms (embedder, recommender,
 *      queue, etc.) — useful aliases for media/AI dashboards
 *   4. Final fallback: a neutral Box icon
 *
 * SVG paths from simple-icons are CC0; brand trademarks remain with
 * their owners. Use them only to identify the third-party services
 * we integrate with, never as endorsement.
 */

import {
  Box,
  Brain,
  Briefcase,
  ChartLine,
  Cloud,
  Cpu,
  Database,
  Globe,
  Mic,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Triangle,
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  siAlgolia,
  siAnthropic,
  siApplepodcasts,
  siBluesky,
  siClickhouse,
  siCloudflare,
  siDatabricks,
  siDatadog,
  siDiscord,
  siDocker,
  siFacebook,
  siFigma,
  siGithub,
  siGitlab,
  siGoogle,
  siGoogleanalytics,
  siGrafana,
  siHtml5,
  siHubspot,
  siHuggingface,
  siInstagram,
  siKubernetes,
  siMastodon,
  siMeta,
  siMistralai,
  siMongodb,
  siNextdotjs,
  siNotion,
  siNvidia,
  siOvercast,
  siPerplexity,
  siPinterest,
  siPostgresql,
  siPrometheus,
  siQdrant,
  siReact,
  siReddit,
  siRss,
  siRedis,
  siSentry,
  siSnapchat,
  siSnowflake,
  siSpotify,
  siStripe,
  siTelegram,
  siTerraform,
  siThreads,
  siTiktok,
  siTwitch,
  siVercel,
  siVimeo,
  siWhatsapp,
  siWordpress,
  siX,
  siYoutube,
  siZoom,
} from "simple-icons";

import { cx } from "../lib";

type SimpleIcon = {
  title: string;
  slug: string;
  hex: string;
  path: string;
};

interface BrandIconResolution {
  kind: "brand";
  icon: SimpleIcon;
}

interface LucideResolution {
  kind: "lucide";
  icon: LucideIcon;
  /** Hex colour roughly mapped to the brand; used when `brandColor` is on. */
  hex?: string;
}

type Resolution = BrandIconResolution | LucideResolution;

/**
 * Brands that simple-icons ships. Keys are case-insensitive canonical
 * service names callers pass; values are the imported SimpleIcon object.
 */
const SIMPLE_ICON_MAP: Record<string, SimpleIcon> = {
  // Stack
  wordpress: siWordpress,
  qdrant: siQdrant,
  clickhouse: siClickhouse,
  redis: siRedis,
  postgres: siPostgresql,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  snowflake: siSnowflake,
  databricks: siDatabricks,
  algolia: siAlgolia,
  cloudflare: siCloudflare,
  vercel: siVercel,
  next: siNextdotjs,
  react: siReact,
  rss: siRss,
  hls: siHtml5,
  docker: siDocker,
  kubernetes: siKubernetes,
  terraform: siTerraform,

  // Observability
  datadog: siDatadog,
  sentry: siSentry,
  grafana: siGrafana,
  prometheus: siPrometheus,

  // AI providers
  anthropic: siAnthropic,
  huggingface: siHuggingface,
  perplexity: siPerplexity,
  mistral: siMistralai,
  mistralai: siMistralai,
  nvidia: siNvidia,

  // Audio / video hosts
  spotify: siSpotify,
  youtube: siYoutube,
  vimeo: siVimeo,
  twitch: siTwitch,
  applepodcasts: siApplepodcasts,
  overcast: siOvercast,

  // Workflow / CRM / payments
  stripe: siStripe,
  notion: siNotion,
  figma: siFigma,
  hubspot: siHubspot,
  zoom: siZoom,

  // Source control
  github: siGithub,
  gitlab: siGitlab,

  // Google
  google: siGoogle,
  googleanalytics: siGoogleanalytics,

  // Social
  x: siX,
  twitter: siX,
  facebook: siFacebook,
  meta: siMeta,
  instagram: siInstagram,
  tiktok: siTiktok,
  threads: siThreads,
  bluesky: siBluesky,
  mastodon: siMastodon,
  pinterest: siPinterest,
  reddit: siReddit,
  discord: siDiscord,
  telegram: siTelegram,
  whatsapp: siWhatsapp,
  snapchat: siSnapchat,
};

/**
 * Brands NOT in simple-icons (or removed by trademark request). We
 * render a category lucide icon tinted roughly to match the brand and
 * rely on the label beside it to identify the service.
 *
 * Brands removed at the request of their owners include AWS, OpenAI,
 * Acast, MUX, LinkedIn, Slack, Salesforce, and Azure.
 */
const FALLBACK_BRAND_MAP: Record<string, { icon: LucideIcon; hex: string }> = {
  // AWS family
  aws: { icon: Cloud, hex: "#FF9900" },
  amazon: { icon: Cloud, hex: "#FF9900" },
  s3: { icon: Cloud, hex: "#FF9900" },
  ecs: { icon: Cloud, hex: "#FF9900" },
  ec2: { icon: Cloud, hex: "#FF9900" },
  lambda: { icon: Cloud, hex: "#FF9900" },

  // AI providers (trademark-blocked)
  openai: { icon: Sparkles, hex: "#10A37F" },

  // Podcast hosts (trademark-blocked or never added)
  acast: { icon: Mic, hex: "#7B61FF" },
  megaphone: { icon: Mic, hex: "#FF6B35" },
  anchor: { icon: Mic, hex: "#5000B9" },

  // Video / streaming
  mux: { icon: Video, hex: "#FB2491" },
  bunnycdn: { icon: Globe, hex: "#FF9900" },

  // Social / SaaS (trademark-blocked from simple-icons)
  linkedin: { icon: Briefcase, hex: "#0A66C2" },
  slack: { icon: Sparkles, hex: "#4A154B" },
  salesforce: { icon: Cloud, hex: "#00A1E0" },
  azure: { icon: Triangle, hex: "#0078D4" },
};

/**
 * Generic category aliases — useful for engine-style dashboards where
 * "embedder" or "recommender" is more semantic than a specific brand.
 * Picks up the consumer's text colour by default.
 */
const CATEGORY_MAP: Record<string, LucideIcon> = {
  embedder: Cpu,
  recommender: Brain,
  "rhm-classifier": ShieldCheck,
  "real-humans": ShieldCheck,
  "token-router": Route,
  router: Route,
  api: Network,
  queue: Database,
  analytics: ChartLine,
  intent: Sparkles,
};

function resolve(name: string): Resolution {
  const key = name.toLowerCase().trim();

  const brand = SIMPLE_ICON_MAP[key];
  if (brand) return { kind: "brand", icon: brand };

  const fallback = FALLBACK_BRAND_MAP[key];
  if (fallback)
    return { kind: "lucide", icon: fallback.icon, hex: fallback.hex };

  const category = CATEGORY_MAP[key];
  if (category) return { kind: "lucide", icon: category };

  return { kind: "lucide", icon: Box };
}

export interface ServiceIconProps {
  /** Canonical service name (case-insensitive). e.g. "qdrant", "aws", "embedder", "x". */
  name: string;
  /** Tailwind size class. Default: size-4 (16px). */
  className?: string;
  /** Render in the service's brand colour rather than `currentColor`. */
  brandColor?: boolean;
  /** Optional aria-label override; defaults to the service name. */
  label?: string;
}

export function ServiceIcon({
  name,
  className,
  brandColor,
  label,
}: ServiceIconProps) {
  const resolved = resolve(name);
  const cls = cx("inline-block size-4", className);
  const ariaLabel = label ?? name;

  if (resolved.kind === "brand") {
    const fill = brandColor ? `#${resolved.icon.hex}` : "currentColor";
    return (
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox="0 0 24 24"
        className={cls}
        fill={fill}
      >
        <title>{resolved.icon.title}</title>
        <path d={resolved.icon.path} />
      </svg>
    );
  }

  const LucideTag = resolved.icon;
  return (
    <LucideTag
      aria-label={ariaLabel}
      className={cls}
      style={brandColor && resolved.hex ? { color: resolved.hex } : undefined}
    />
  );
}

/**
 * Names this component knows about. Useful for Storybook / docs.
 * Sorted by category for legibility.
 */
export const SERVICE_ICON_NAMES = {
  brands: Object.keys(SIMPLE_ICON_MAP).sort(),
  fallbackBrands: Object.keys(FALLBACK_BRAND_MAP).sort(),
  categories: Object.keys(CATEGORY_MAP).sort(),
} as const;
