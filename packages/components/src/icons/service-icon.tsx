/**
 * ServiceIcon — single entry point for rendering a service mark.
 *
 * Resolution order:
 *   1. simple-icons brand SVG (3,400+ available; tree-shakable named
 *      imports, so the bundle carries only what SIMPLE_ICON_MAP names)
 *   2. Hand-curated brand SVG — for brands simple-icons cannot ship
 *      (AWS, Azure, OpenAI, LinkedIn, Slack, Salesforce, Tableau).
 *      Added with `node tools/curate-brand-mark.mjs`, never by hand.
 *   3. Lucide category icon tinted to a brand hex — what is left of the
 *      trademark-blocked set (MUX, Acast, Megaphone, BunnyCDN)
 *   4. Lucide category icon for generic infra terms (embedder, recommender,
 *      queue, etc.) — useful aliases for media/AI dashboards
 *   5. Final fallback: a neutral Box icon
 *
 * SVG paths from simple-icons are CC0. Curated marks come from a file
 * the owner published — AWS under Apache-2.0 and Azure in the public
 * domain via Wikimedia Commons, the rest via SVG Repo. Each entry says
 * where its artwork came from.
 *
 * Every one of these is trademarked regardless of the artwork's
 * licence. Use them only to identify the third-party services we
 * integrate with or run on, never as endorsement, and never redraw one
 * by hand — a mark that is close is worse than a generic glyph.
 */

import {
  Box,
  Brain,
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
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  siAirtable,
  siAkamai,
  siAlgolia,
  siAngular,
  siAnsible,
  siAnthropic,
  siApacheairflow,
  siApachekafka,
  siApplepodcasts,
  siAsana,
  siAstro,
  siAuth0,
  siBluesky,
  siBun,
  siCircleci,
  siClerk,
  siClickhouse,
  siCloudflare,
  siCloudinary,
  siContentful,
  siDatabricks,
  siDatadog,
  siDeepgram,
  siDeno,
  siDigitalocean,
  siDirectus,
  siDiscord,
  siDocker,
  siDuckdb,
  siElasticsearch,
  siElevenlabs,
  siFacebook,
  siFastly,
  siFigma,
  siFirebase,
  siFramer,
  siGhost,
  siGithub,
  siGithubactions,
  siGitlab,
  siGoogle,
  siGoogleanalytics,
  siGooglebigquery,
  siGooglecloud,
  siGooglegemini,
  siGrafana,
  siHtml5,
  siHubspot,
  siHuggingface,
  siInstagram,
  siIntercom,
  siJavascript,
  siJenkins,
  siJira,
  siJupyter,
  siKubernetes,
  siLangchain,
  siLaravel,
  siLemonsqueezy,
  siLinear,
  siMailchimp,
  siMake,
  siMariadb,
  siMastodon,
  siMeilisearch,
  siMeta,
  siMistralai,
  siMixpanel,
  siMlflow,
  siModal,
  siMongodb,
  siMysql,
  siN8n,
  siNeo4j,
  siNetlify,
  siNewrelic,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siNotion,
  siNpm,
  siNuxt,
  siNvidia,
  siOkta,
  siOllama,
  siOpensearch,
  siOpentelemetry,
  siOvercast,
  siPaddle,
  siPagerduty,
  siPayloadcms,
  siPaypal,
  siPerplexity,
  siPhp,
  siPinterest,
  siPlanetscale,
  siPnpm,
  siPostgresql,
  siPosthog,
  siPrometheus,
  siPulumi,
  siPython,
  siPytorch,
  siQdrant,
  siRabbitmq,
  siRailway,
  siReact,
  siReddit,
  siRemix,
  siReplicate,
  siResend,
  siRss,
  siRedis,
  siSanity,
  siSentry,
  siShopify,
  siSnapchat,
  siSnowflake,
  siSpotify,
  siSquare,
  siStoryblok,
  siStrapi,
  siStripe,
  siSupabase,
  siSvelte,
  siTailwindcss,
  siTelegram,
  siTensorflow,
  siTerraform,
  siThreads,
  siTiktok,
  siTurborepo,
  siTwitch,
  siTypescript,
  siVault,
  siVercel,
  siVimeo,
  siVite,
  siVuedotjs,
  siWebflow,
  siWhatsapp,
  siWoocommerce,
  siWordpress,
  siX,
  siYoutube,
  siZapier,
  siZendesk,
  siZoom,
} from "simple-icons";

import { cx } from "../lib";

type SimpleIcon = {
  title: string;
  slug: string;
  hex: string;
  path: string;
};

/**
 * A hand-curated mark, which real artwork sometimes needs more room than
 * simple-icons' shape allows:
 *
 *   viewBox — a wordmark lockup is not square (AWS is 304×182). Forcing
 *   it into 24×24 would stretch it, so a curated mark keeps its own box
 *   and letterboxes inside whatever square the caller gives it.
 *
 *   path as an array — overlapping subpaths whose UNION is the shape.
 *   Neither fill-rule expresses that: nonzero and evenodd both punch the
 *   overlaps out as holes (measured on Azure: 40% and 49% of inked
 *   pixels wrong). Painting each path in the same colour is the union,
 *   exactly and without a boolean-geometry pass.
 *
 *   fillRule — the opposite case. A lockup carries its wordmark as
 *   detail cut OUT of the ink (Salesforce: one cloud, ten white
 *   letterforms). That is ONE path on evenodd; separate paths would
 *   fill the letters in and leave a blob.
 *
 * Both shapes come out of `node tools/curate-brand-mark.mjs`, which
 * picks between them by reading the source's own fills.
 */
type CuratedIcon = Omit<SimpleIcon, "path"> & {
  path: string | string[];
  viewBox?: string;
  fillRule?: "evenodd";
};

interface BrandIconResolution {
  kind: "brand";
  icon: SimpleIcon | CuratedIcon;
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

  // Cloud / hosting
  googlecloud: siGooglecloud,
  gcp: siGooglecloud,
  digitalocean: siDigitalocean,
  fastly: siFastly,
  akamai: siAkamai,
  netlify: siNetlify,
  railway: siRailway,
  supabase: siSupabase,
  firebase: siFirebase,
  nginx: siNginx,

  // Data / warehouse / streaming
  googlebigquery: siGooglebigquery,
  bigquery: siGooglebigquery,
  duckdb: siDuckdb,
  mysql: siMysql,
  mariadb: siMariadb,
  elasticsearch: siElasticsearch,
  elastic: siElasticsearch,
  opensearch: siOpensearch,
  apachekafka: siApachekafka,
  kafka: siApachekafka,
  rabbitmq: siRabbitmq,
  apacheairflow: siApacheairflow,
  airflow: siApacheairflow,
  neo4j: siNeo4j,
  meilisearch: siMeilisearch,
  planetscale: siPlanetscale,

  // AI / ML
  googlegemini: siGooglegemini,
  gemini: siGooglegemini,
  langchain: siLangchain,
  ollama: siOllama,
  replicate: siReplicate,
  pytorch: siPytorch,
  tensorflow: siTensorflow,
  jupyter: siJupyter,
  elevenlabs: siElevenlabs,
  deepgram: siDeepgram,
  mlflow: siMlflow,
  modal: siModal,

  // DevOps / CI / reliability
  githubactions: siGithubactions,
  circleci: siCircleci,
  jenkins: siJenkins,
  ansible: siAnsible,
  pulumi: siPulumi,
  vault: siVault,
  opentelemetry: siOpentelemetry,
  otel: siOpentelemetry,
  newrelic: siNewrelic,
  pagerduty: siPagerduty,

  // Languages / runtimes / build
  typescript: siTypescript,
  ts: siTypescript,
  javascript: siJavascript,
  js: siJavascript,
  python: siPython,
  php: siPhp,
  laravel: siLaravel,
  nodedotjs: siNodedotjs,
  node: siNodedotjs,
  nodejs: siNodedotjs,
  deno: siDeno,
  bun: siBun,
  astro: siAstro,
  svelte: siSvelte,
  vuedotjs: siVuedotjs,
  vue: siVuedotjs,
  angular: siAngular,
  nuxt: siNuxt,
  remix: siRemix,
  tailwindcss: siTailwindcss,
  tailwind: siTailwindcss,
  vite: siVite,
  turborepo: siTurborepo,
  pnpm: siPnpm,
  npm: siNpm,

  // CMS / commerce
  woocommerce: siWoocommerce,
  shopify: siShopify,
  contentful: siContentful,
  sanity: siSanity,
  strapi: siStrapi,
  ghost: siGhost,
  webflow: siWebflow,
  framer: siFramer,
  payloadcms: siPayloadcms,
  storyblok: siStoryblok,
  directus: siDirectus,

  // Product / GTM / auth / payments
  posthog: siPosthog,
  mixpanel: siMixpanel,
  linear: siLinear,
  jira: siJira,
  asana: siAsana,
  airtable: siAirtable,
  zapier: siZapier,
  n8n: siN8n,
  make: siMake,
  intercom: siIntercom,
  zendesk: siZendesk,
  resend: siResend,
  mailchimp: siMailchimp,
  auth0: siAuth0,
  okta: siOkta,
  clerk: siClerk,
  cloudinary: siCloudinary,
  paddle: siPaddle,
  lemonsqueezy: siLemonsqueezy,
  paypal: siPaypal,
  square: siSquare,
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
const CUSTOM_BRAND_ICONS: Record<string, CuratedIcon> = {
  // AWS — the horizontal lockup (wordmark + smile). Apache-2.0 file
  // published by Amazon, via Wikimedia Commons.
  aws: {
    title: "Amazon Web Services",
    slug: "aws",
    hex: "FF9900",
    viewBox: "1.67 1.1 300.67 179.8",
    path: [
      "M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3L83.2 92c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9Q59.2 94.7 41.5 94.7c-8.4 0-15.1-2.4-20-7.2s-7.4-11.2-7.4-19.2c0-8.5 3-15.4 9.1-20.6s14.2-7.8 24.5-7.8c3.4 0 6.9.3 10.6.8s7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3s-7.3 2-10.8 3.4c-1.6.7-2.8 1.1-3.5 1.3s-1.2.3-1.6.3c-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5s1.4-1.4 2.8-2.1Q28.75 5 36.1 3.2C41 1.9 46.2 1.3 51.7 1.3c11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8s6.8-3.4 9.5-6.4c1.6-1.9 2.8-4 3.4-6.4s1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7s-6.3-.6-9.4-.6c-6.7 0-11.6 1.3-14.9 4s-4.9 6.5-4.9 11.5c0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7m80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9s2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6s-.3 1.4-.7 2.5l-24.1 77.3q-.9 3-2.1 3.9c-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1s-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4s-2.2 1-4 1zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8s-8.9-2.5-11.5-4c-1.6-.9-2.7-1.9-3.1-2.8s-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1q.9 0 1.8.3c.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3s5.2-5.4 5.2-9.5c0-2.8-.9-5.1-2.7-7s-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5q0-6.3 2.7-11.1c1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2s8.2-1.7 12.6-1.7c2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6q2.7.9 4.2 1.8c1.4.8 2.4 1.6 3 2.5q.9 1.2.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2q-8.55-3.9-19.2-3.9c-5.7 0-10.2.9-13.3 2.8s-4.7 4.8-4.7 8.9c0 2.8 1 5.2 3 7.1s5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6s4.6 8.8 4.6 14c0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.4-9.2 2.1-14.3 2.1",
      "M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.5 10.2 3.6 4.8 7.6",
      "M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 4-9.9 12.9-32.2 8.7-37.5",
    ],
  },
  // Azure — the folded "A". Public domain via Wikimedia Commons.
  // Four overlapping paths; in one colour their union IS the shape.
  azure: {
    title: "Microsoft Azure",
    slug: "azure",
    hex: "0078D4",
    viewBox: "4 6.54 87.99 82.91",
    path: [
      "M33.338 6.544h26.038l-27.03 80.087a4.152 4.152 0 0 1-3.933 2.824H8.149a4.145 4.145 0 0 1-3.928-5.47L29.404 9.368a4.152 4.152 0 0 1 3.934-2.825z",
      "M71.175 60.261h-41.29a1.911 1.911 0 0 0-1.305 3.309l26.532 24.764a4.17 4.17 0 0 0 2.846 1.121h23.38z",
      "M33.338 6.544a4.118 4.118 0 0 0-3.943 2.879L4.252 83.917a4.14 4.14 0 0 0 3.908 5.538h20.787a4.443 4.443 0 0 0 3.41-2.9l5.014-14.777 17.91 16.705a4.237 4.237 0 0 0 2.666.972H81.24L71.024 60.261l-29.781.007L59.47 6.544z",
      "M66.595 9.364a4.145 4.145 0 0 0-3.928-2.82H33.648a4.146 4.146 0 0 1 3.928 2.82l25.184 74.62a4.146 4.146 0 0 1-3.928 5.472h29.02a4.146 4.146 0 0 0 3.927-5.472z",
    ],
  },
  // LinkedIn — the "in" square. Via SVG Repo.
  linkedin: {
    title: "LinkedIn",
    slug: "linkedin",
    hex: "0A66C2",
    viewBox: "0 0 382 382",
    path: "M347.445 0H34.555C15.471 0 0 15.471 0 34.555v312.889C0 366.529 15.471 382 34.555 382h312.889C366.529 382 382 366.529 382 347.444V34.555C382 15.471 366.529 0 347.445 0M118.207 329.844c0 5.554-4.502 10.056-10.056 10.056H65.345c-5.554 0-10.056-4.502-10.056-10.056V150.403c0-5.554 4.502-10.056 10.056-10.056h42.806c5.554 0 10.056 4.502 10.056 10.056zM86.748 123.432c-22.459 0-40.666-18.207-40.666-40.666S64.289 42.1 86.748 42.1s40.666 18.207 40.666 40.666-18.206 40.666-40.666 40.666M341.91 330.654c0 5.106-4.14 9.246-9.246 9.246H286.73c-5.106 0-9.246-4.14-9.246-9.246v-84.168c0-12.556 3.683-55.021-32.813-55.021-28.309 0-34.051 29.066-35.204 42.11v97.079c0 5.106-4.139 9.246-9.246 9.246h-44.426c-5.106 0-9.246-4.14-9.246-9.246V149.593c0-5.106 4.14-9.246 9.246-9.246h44.426c5.106 0 9.246 4.14 9.246 9.246v15.655c10.497-15.753 26.097-27.912 59.312-27.912 73.552 0 73.131 68.716 73.131 106.472z",
  },
  // OpenAI — hexagonal flower mark, single-colour silhouette.
  openai: {
    title: "OpenAI",
    slug: "openai",
    hex: "10A37F",
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.83-2.7866a4.4992 4.4992 0 0 1 6.68 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
  // Salesforce — the cloud lockup. Its wordmark is cut OUT of the
  // ink, which is why this one is a single evenodd path. Via SVG Repo.
  salesforce: {
    title: "Salesforce",
    slug: "salesforce",
    hex: "00A1E0",
    viewBox: "0.13 0.13 255.74 179.01",
    fillRule: "evenodd",
    path: "M106.5532 19.6512c8.248-8.594 19.731-13.9238 32.4307-13.9238 16.882 0 31.611 9.4137 39.4545 23.3886 6.8162-3.0457 14.361-4.7397 22.2993-4.7397 30.4488 0 55.1343 24.9004 55.1343 55.6152 0 30.7185-24.6855 55.6189-55.1343 55.6189-3.716 0-7.3481-.3716-10.86-1.082-6.9073 12.3209-20.0698 20.6453-35.1776 20.6453-6.3244 0-12.3063-1.4609-17.6325-4.0584-7.002 16.4704-23.3157 28.019-42.3289 28.019-19.8001 0-36.6748-12.5286-43.1522-30.0992-2.8307.6011-5.7634.9144-8.7726.9144-23.5743 0-42.6859-19.3083-42.6859-43.1304 0-15.964 8.5867-29.9023 21.3448-37.3597-2.6267-6.0439-4.0875-12.7143-4.0875-19.7273C17.3853 22.3362 39.6263.128 67.0586.128c16.106 0 30.4197 7.6577 39.4946 19.5232 M37.17 92.9561c-.1602.419.0584.5064.1094.5793.4809.3497.969.6011 1.4608.8816 2.6085 1.3844 5.0712 1.7888 7.6469 1.7888 5.246 0 8.5029-2.7906 8.5029-7.2825v-.0875c0-4.153-3.6759-5.6613-7.1259-6.7506l-.448-.1457c-2.6012-.8452-4.8453-1.5738-4.8453-3.286v-.0911c0-1.4646 1.3115-2.543 3.3443-2.543 2.2587 0 4.94.7506 6.6668 1.705 0 0 .5064.328.6922-.1639.102-.2623.9764-2.6157 1.0674-2.8707.0984-.277-.0765-.481-.255-.5902-1.9709-1.1986-4.696-2.0183-7.5157-2.0183l-.5246.0037c-4.8015 0-8.1532 2.8998-8.1532 7.0566v.0874c0 4.3827 3.6978 5.8035 7.1623 6.7944l.5574.1712c2.5247.776 4.6996 1.4427 4.6996 3.2205v.0874c0 1.6248-1.4135 2.8343-3.694 2.8343-.8854 0-3.7087-.0182-6.758-1.9454-.368-.215-.5829-.3716-.867-.5428-.1494-.0947-.5247-.2587-.6886.2368z M113.9698 92.9561c-.1603.419.0583.5064.1093.5793.4809.3497.969.6011 1.4608.8816 2.6085 1.3844 5.0712 1.7888 7.6469 1.7888 5.246 0 8.5029-2.7906 8.5029-7.2825v-.0875c0-4.153-3.6759-5.6613-7.1259-6.7506l-.448-.1457c-2.6012-.8452-4.8453-1.5738-4.8453-3.286v-.0911c0-1.4646 1.3115-2.543 3.3443-2.543 2.2587 0 4.94.7506 6.6668 1.705 0 0 .5064.328.6922-.1639.102-.2623.9764-2.6157 1.0674-2.8707.0984-.277-.0765-.481-.255-.5902-1.9709-1.1986-4.6959-2.0183-7.5156-2.0183l-.5246.0037c-4.8016 0-8.1533 2.8998-8.1533 7.0566v.0874c0 4.3827 3.6978 5.8035 7.1623 6.7944l.5574.1712c2.5247.776 4.7032 1.4427 4.7032 3.2205v.0874c0 1.6248-1.4171 2.8343-3.6977 2.8343-.8853 0-3.7086-.0182-6.7579-1.9454-.368-.215-.5865-.3643-.8634-.5428-.0947-.062-.5392-.2332-.6922.2368z M166.3988 84.1574c0 2.5392-.4736 4.5393-1.4063 5.9528-.9217 1.399-2.317 2.0802-4.2624 2.0802-1.949 0-3.337-.6776-4.2441-2.0802-.9181-1.4099-1.3844-3.4136-1.3844-5.9528 0-2.5356.4663-4.532 1.3844-5.931.907-1.3843 2.2951-2.0583 4.2441-2.0583 1.9454 0 3.3407.674 4.266 2.0584.929 1.3989 1.4027 3.3953 1.4027 5.9309m4.379-4.7069c-.43-1.4536-1.1003-2.736-1.9928-3.8033-.8926-1.0711-2.022-1.9309-3.3626-2.5575-1.337-.623-2.918-.9399-4.6923-.9399-1.7778 0-3.3589.317-4.6959.94-1.3406.6265-2.47 1.4863-3.3662 2.5574-.8889 1.071-1.5592 2.3534-1.9928 3.8033-.4262 1.4463-.6411 3.0274-.6411 4.7069s.215 3.2642.6411 4.7068c.4336 1.45 1.1003 2.7324 1.9965 3.8034.8925 1.071 2.0255 1.9272 3.3625 2.5356 1.3407.6084 2.9181.918 4.696.918 1.7741 0 3.3516-.3096 4.6922-.918 1.337-.6084 2.47-1.4645 3.3626-2.5356.8925-1.0674 1.5629-2.3498 1.9927-3.8034.43-1.4463.6449-3.031.6449-4.7068s-.215-3.2606-.6449-4.7069 M206.7375 91.5124c-.1457-.4262-.5574-.266-.5574-.266-.6375.2441-1.3152.47-2.0365.583-.7322.1129-1.5374.1712-2.4008.1712-2.1202 0-3.8033-.6303-5.0092-1.8762-1.2095-1.246-1.8871-3.2606-1.8798-5.9856.0073-2.481.6047-4.3462 1.6794-5.767 1.0674-1.4135 2.6923-2.1385 4.8599-2.1385 1.807 0 3.184.2077 4.6267.663 0 0 .346.1494.51-.3023.3826-1.0638.6667-1.8252 1.0747-2.9946.1166-.3315-.1675-.4736-.2696-.5137-.5683-.2222-1.909-.5829-2.9217-.7359-.9472-.1457-2.0547-.2222-3.286-.2222-1.8398 0-3.4792.3133-4.8818.9399-1.399.623-2.5866 1.4827-3.5265 2.5538s-1.654 2.3534-2.1312 3.8034c-.4736 1.4463-.714 3.0346-.714 4.7141 0 3.6322.98 6.5685 2.9144 8.7179 1.9382 2.1567 4.849 3.2533 8.645 3.2533 2.2442 0 4.5466-.4554 6.2006-1.1075 0 0 .317-.153.1785-.521z M214.3992 81.725c.2077-1.41.5975-2.583 1.1986-3.4974.9071-1.388 2.2915-2.1495 4.2369-2.1495s3.2314.765 4.153 2.1495c.6121.9144.878 2.1384.9837 3.4973zm14.7435-3.1003c-.3716-1.4026-1.2933-2.8198-1.898-3.4683-.9545-1.0273-1.8871-1.745-2.8125-2.1457-1.2095-.5173-2.6594-.8598-4.2478-.8598-1.8507 0-3.5301.3097-4.8926.9508-1.3662.6412-2.5138 1.5156-3.4136 2.6048-.8998 1.0857-1.5775 2.379-2.0073 3.8471-.4336 1.461-.6522 3.053-.6522 4.7324 0 1.7086.226 3.3006.674 4.7323.4518 1.4427 1.173 2.7141 2.1494 3.767.9727 1.0601 2.226 1.8907 3.7269 2.47 1.49.5756 3.3006.8743 5.3808.8707 4.2806-.0146 6.5357-.969 7.4647-1.4827.164-.0911.3206-.2514.1239-.7104l-.9691-2.7141c-.1457-.4044-.5574-.255-.5574-.255-1.0601.3934-2.5684 1.1002-6.084 1.0929-2.2987-.0037-4.0037-.6813-5.0711-1.7414-1.0966-1.0857-1.6321-2.6813-1.7268-4.9327l14.8237.0145s.3898-.0073.4298-.3861c.0146-.1603.51-3.0456-.4408-6.3863 M95.683 81.725c.2113-1.41.5975-2.583 1.1986-3.4974.907-1.388 2.2915-2.1495 4.2369-2.1495s3.2314.765 4.1567 2.1495c.6084.9144.8744 2.1384.98 3.4973zm14.7399-3.1003c-.3716-1.4026-1.2897-2.8198-1.8944-3.4683-.9545-1.0273-1.8871-1.745-2.8125-2.1457-1.2095-.5173-2.6594-.8598-4.2478-.8598-1.847 0-3.5301.3097-4.8927.9508-1.3661.6412-2.5137 1.5156-3.4135 2.6048-.8999 1.0857-1.5775 2.379-2.0074 3.8471-.4298 1.461-.652 3.053-.652 4.7324 0 1.7086.2258 3.3006.6739 4.7323.4517 1.4427 1.173 2.7141 2.1494 3.767.9727 1.0601 2.226 1.8907 3.7269 2.47 1.49.5756 3.3006.8743 5.3808.8707 4.2806-.0146 6.5357-.969 7.4647-1.4827.164-.0911.3206-.2514.1238-.7104l-.9654-2.7141c-.1493-.4044-.561-.255-.561-.255-1.0601.3934-2.5647 1.1002-6.0876 1.0929-2.2951-.0037-4-.6813-5.0675-1.7414-1.0966-1.0857-1.6321-2.6813-1.7268-4.9327l14.8237.0145s.3898-.0073.4298-.3861c.0146-.1603.51-3.0456-.4444-6.3863 M63.6418 91.4312c-.5793-.4627-.6594-.5793-.8562-.878-.2914-.4554-.4408-1.1039-.4408-1.9272 0-1.3042.43-2.2405 1.3225-2.8708-.011.0037 1.275-1.1111 4.2988-1.071 2.124.0291 4.022.3424 4.022.3424v6.7397h.0036s-1.8835.4044-4.0037.532c-3.0165.182-4.3572-.8708-4.3462-.8671m5.8981-10.4156c-.6011-.0437-1.3807-.0692-2.3133-.0692-1.2715 0-2.4992.1603-3.6504.47-1.1585.3096-2.2004.7941-3.0966 1.4353-.8999.6448-1.6248 1.4682-2.1494 2.4445s-.7906 2.1276-.7906 3.4172c0 1.3115.2259 2.4518.6776 3.3844.4518.9363 1.1039 1.716 1.9345 2.317.8233.6011 1.8398 1.042 3.0201 1.3079 1.1621.266 2.481.4007 3.9236.4007 1.5192 0 3.0347-.1238 4.5028-.3752 1.4536-.2477 3.2387-.6084 3.7342-.7213.4918-.1166 1.0383-.266 1.0383-.266.368-.091.3388-.4845.3388-.4845l-.0073-13.5559c0-2.9727-.7942-5.1768-2.357-6.543-1.5557-1.3625-3.8472-2.051-6.809-2.051-1.1111 0-2.8999.153-3.971.368 0 0-3.2386.6266-4.572 1.6685 0 0-.2914.1821-.1312.5902l1.0493 2.8197c.1311.3643.4845.2404.4845.2404s.113-.0437.244-.1202c2.8526-1.552 6.4592-1.5046 6.4592-1.5046 1.603 0 2.8344.3206 3.665.9582.8087.6193 1.2204 1.5555 1.2204 3.53v.6267c-1.275-.1822-2.4445-.2878-2.4445-.2878 M189.0991 73.3775c.113-.3351-.1238-.4954-.2222-.5319-.2514-.0983-1.5119-.3643-2.4846-.4262-1.8616-.113-2.8962.2004-3.8216.6157-.918.4153-1.938 1.0856-2.5064 1.847v-1.8033c0-.2514-.1785-.4518-.4262-.4518h-3.7998c-.2477 0-.4262.2004-.4262.4518v22.1098c0 .2478.204.4518.4517.4518h3.8945c.2477 0 .448-.204.448-.4518V84.1428c0-1.4827.164-2.9618.4919-3.8908.3206-.918.7578-1.654 1.297-2.1822.5428-.5246 1.1584-.8925 1.8324-1.1002.6885-.2113 1.45-.2805 1.9891-.2805.776 0 1.6285.2003 1.6285.2003.2841.0328.4444-.142.5392-.4007.255-.6776.9763-2.7068 1.1147-3.1112 M152.5438 63.1303c-.4736-.1457-.9035-.2441-1.4646-.3497-.5683-.102-1.2459-.153-2.0146-.153-2.6813 0-4.7943.7577-6.277 2.2514-1.4754 1.4863-2.4773 3.7487-2.98 6.725l-.1822 1.002h-3.3662s-.408-.0146-.4954.4298l-.5502 3.0857c-.04.2914.0875.4772.481.4772h3.275l-3.3224 18.5506c-.2587 1.4937-.5574 2.7214-.889 3.654-.3242.918-.6411 1.6066-1.0346 2.1093-.3788.481-.7359.838-1.3552 1.0456-.51.1712-1.1002.2514-1.745.2514-.357 0-.8343-.0583-1.1877-.1312-.3497-.0692-.5355-.1457-.8014-.2586 0 0-.3826-.1458-.5356.2368-.1202.317-.9945 2.7177-1.1002 3.0128-.102.295.0437.5246.2295.5938.4372.153.7614.255 1.3553.3971.8233.193 1.5191.204 2.1712.204 1.3625 0 2.6085-.193 3.6395-.5647 1.0346-.3752 1.938-1.0273 2.7396-1.909.8634-.9544 1.4062-1.9526 1.9235-3.3188.5137-1.348.9545-3.0237 1.3042-4.9764l3.3407-18.8967h4.8817s.4117.0146.4955-.4335l.5537-3.082c.0365-.2951-.0874-.4773-.4845-.4773h-4.7396c.0255-.1056.2404-1.7741.7832-3.3443.2332-.6667.6704-1.2095 1.0383-1.5811.3643-.3643.7833-.623 1.2423-.7723.47-.153 1.0055-.226 1.592-.226.4445 0 .8853.051 1.2168.1203.459.0984.6376.1494.7578.1858.4845.1457.55.0036.6448-.2295l1.133-3.1112c.1166-.3352-.1712-.4772-.2732-.5173 M86.3217 95.1897c0 .2477-.1785.4481-.4262.4481h-3.9309c-.2477 0-.4226-.2004-.4226-.448V63.5531c0-.2477.1749-.448.4226-.448h3.9309c.2477 0 .4262.2003.4262.448z",
  },
  // Slack — the four-piece hash. Via SVG Repo.
  slack: {
    title: "Slack",
    slug: "slack",
    hex: "4A154B",
    viewBox: "1 1 14 14",
    path: [
      "M2.471 11.318a1.474 1.474 0 0 0 1.47-1.471v-1.47h-1.47A1.474 1.474 0 0 0 1 9.846c.001.811.659 1.469 1.47 1.47zm3.682-2.942a1.474 1.474 0 0 0-1.47 1.471v3.683c.002.811.66 1.468 1.47 1.47a1.474 1.474 0 0 0 1.47-1.47V9.846a1.474 1.474 0 0 0-1.47-1.47",
      "M4.683 2.471c.001.811.659 1.469 1.47 1.47h1.47v-1.47A1.474 1.474 0 0 0 6.154 1a1.474 1.474 0 0 0-1.47 1.47zm2.94 3.682a1.474 1.474 0 0 0-1.47-1.47H2.47A1.474 1.474 0 0 0 1 6.153c.002.812.66 1.469 1.47 1.47h3.684a1.474 1.474 0 0 0 1.47-1.47z",
      "M9.847 7.624a1.474 1.474 0 0 0 1.47-1.47V2.47A1.474 1.474 0 0 0 9.848 1a1.474 1.474 0 0 0-1.47 1.47v3.684c.002.81.659 1.468 1.47 1.47zm3.682-2.941a1.474 1.474 0 0 0-1.47 1.47v1.47h1.47A1.474 1.474 0 0 0 15 6.154a1.474 1.474 0 0 0-1.47-1.47z",
      "M8.377 9.847c.002.811.659 1.469 1.47 1.47h3.683A1.474 1.474 0 0 0 15 9.848a1.474 1.474 0 0 0-1.47-1.47H9.847a1.474 1.474 0 0 0-1.47 1.47zm2.94 3.682a1.474 1.474 0 0 0-1.47-1.47h-1.47v1.47c.002.812.659 1.469 1.47 1.47a1.474 1.474 0 0 0 1.47-1.47",
    ],
  },
  // Tableau — the plus grid, nine shapes unioned. Via SVG Repo.
  tableau: {
    title: "Tableau",
    slug: "tableau",
    hex: "E97627",
    viewBox: "0 0 256 250.79",
    path: [
      "M123.9294 11.5932v11.6406H103.109v7.5711h20.8205v23.1865h8.139V30.8049h21.341v-7.571h-21.341V0h-8.139z",
      "M55.8842 41.1205v16.893H24.3695v10.5996h31.5147v34.3065H67.572V68.6131h31.9878V58.0135H67.5721v-33.786H55.884z",
      "M187.9525 41.1205v16.893h-31.5147v11.12h31.5147v33.7861h12.1611v-33.786h31.5147v-11.12h-31.5147v-33.786h-12.161z",
      "M120.901 98.6609v18.9277H85.8373v14.1012h35.0637v37.8555h14.1958v-37.8555h35.0636v-14.1012h-35.0636V79.7331H120.901z",
      "M224.0099 108.2194v11.8771h-21.341v9.6059h21.341v23.707h10.6468v-23.707h21.341v-9.6059h-21.341v-23.707H224.01z",
      "M20.8205 109.2604v11.3567H0v8.0443h20.8205v22.7132h8.139v-22.7132l21.341-.7572v-7.2871h-21.341V97.9038h-8.139z",
      "M55.8842 162.7313v16.893H24.3695v11.12h31.5147v33.786h12.161v-33.786H99.56v-11.12H68.0452v-33.786h-12.161z",
      "M187.9525 162.7313v16.893h-31.5147v10.5995h31.5147v34.3066h12.1611v-34.3066h31.5147v-10.5995h-31.5147v-33.786h-12.161z",
      "M122.9357 205.65v11.8298h-21.341v9.6058h21.341v23.707h10.6469v-23.707h21.341v-9.6058h-21.341v-23.707h-10.6469z",
    ],
  },
};

/**
 * Brands NOT in simple-icons (or removed by trademark request) and
 * NOT yet curated in CUSTOM_BRAND_ICONS. We render a category lucide
 * icon tinted roughly to match the brand and rely on the label beside
 * it to identify the service.
 *
 * Every entry below is a placeholder that reads correctly only next to
 * its label. To promote one, find the SVG the owner publishes and run
 * `node tools/curate-brand-mark.mjs` on it — that handles the flatten,
 * picks union vs knockout, and shows you the result beside the source
 * so a wrong silhouette gets caught before it ships.
 *
 * What is left here is podcast/CDN infrastructure plus the AWS service
 * names, which are service names rather than marks.
 */
const FALLBACK_BRAND_MAP: Record<string, { icon: LucideIcon; hex: string }> = {
  // `aws` itself is curated above. These are not: Amazon the retailer
  // is a different brand, and S3/EC2/Lambda are service names rather
  // than marks — stamping the AWS lockup on each would read as four
  // copies of the same logo, which is worse than a tinted glyph beside
  // a label that already says which service it is.
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
    // simple-icons is always a square 24; a curated mark may carry its
    // own box, and letterboxes inside the caller's square rather than
    // stretching to fill it.
    const viewBox =
      ("viewBox" in resolved.icon && resolved.icon.viewBox) || "0 0 24 24";
    // Several paths in ONE colour is the union of overlapping shapes.
    // See CuratedIcon — no fill-rule can express it.
    const paths = Array.isArray(resolved.icon.path)
      ? resolved.icon.path
      : [resolved.icon.path];
    // Only a knockout mark sets this, and only on a single path — see
    // CuratedIcon. Absent means the browser default, nonzero.
    const fillRule =
      ("fillRule" in resolved.icon && resolved.icon.fillRule) || undefined;
    return (
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox={viewBox}
        className={cls}
        fill={fill}
        fillRule={fillRule}
      >
        <title>{resolved.icon.title}</title>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
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
