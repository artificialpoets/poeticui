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
 * Hand-curated single-colour brand SVG paths for brands that are NOT
 * in simple-icons (typically because the brand owner asked simple-icons
 * to remove them). Same shape as simple-icons (`{ title, slug, hex,
 * path }`) so the renderer can treat them identically.
 *
 * Add a brand here when a Lucide-tinted fallback isn't recognisable
 * enough — these are the brands users actually look for.
 */
const CUSTOM_BRAND_ICONS: Record<string, SimpleIcon> = {
  // OpenAI — hexagonal flower mark, single-colour silhouette.
  openai: {
    title: "OpenAI",
    slug: "openai",
    hex: "10A37F",
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.83-2.7866a4.4992 4.4992 0 0 1 6.68 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
};

/**
 * Brands NOT in simple-icons (or removed by trademark request) and
 * NOT yet curated in CUSTOM_BRAND_ICONS. We render a category lucide
 * icon tinted roughly to match the brand and rely on the label beside
 * it to identify the service.
 *
 * Brands removed at the request of their owners include AWS, OpenAI,
 * Acast, MUX, LinkedIn, Slack, Salesforce, and Azure. Curate one into
 * CUSTOM_BRAND_ICONS when a Lucide tint isn't recognisable enough.
 */
const FALLBACK_BRAND_MAP: Record<string, { icon: LucideIcon; hex: string }> = {
  // AWS family
  aws: { icon: Cloud, hex: "#FF9900" },
  amazon: { icon: Cloud, hex: "#FF9900" },
  s3: { icon: Cloud, hex: "#FF9900" },
  ecs: { icon: Cloud, hex: "#FF9900" },
  ec2: { icon: Cloud, hex: "#FF9900" },
  lambda: { icon: Cloud, hex: "#FF9900" },

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

  const custom = CUSTOM_BRAND_ICONS[key];
  if (custom) return { kind: "brand", icon: custom };

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
  customBrands: Object.keys(CUSTOM_BRAND_ICONS).sort(),
  fallbackBrands: Object.keys(FALLBACK_BRAND_MAP).sort(),
  categories: Object.keys(CATEGORY_MAP).sort(),
} as const;
