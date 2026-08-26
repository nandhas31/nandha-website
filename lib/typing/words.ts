/**
 * A word list themed to AI-era developer life, in the voice of a nineteen
 * year old who just got into a YC batch: CLI commands, the coding tools
 * everyone has open, the creators everyone watches, the names on every 101
 * billboard, comp talk, and Bookface.
 * Every entry is a single unbroken token (no spaces, no hyphens), since a
 * space submits a word. Multi-word entries live in `PHRASES` instead.
 */
const COMMON_WORDS = [
  "npm", "npx", "yarn", "pnpm", "git", "docker", "kubectl", "curl", "ssh", "vim",
  "grep", "sudo", "chmod", "brew", "pip", "vercel", "deploy", "ship", "push", "pull",
  "commit", "merge", "rebase", "clone", "fork", "branch", "staging", "prod", "localhost", "terminal",
  "stdout", "stderr", "refactor", "deprecate", "legacy", "boilerplate", "scaffold", "monorepo", "rollback", "canary",
  "feature", "hotfix", "pr", "lgtm", "typescript", "react", "nextjs", "tailwind", "vite", "eslint",
  "prettier", "jest", "playwright", "graphql", "rest", "websocket", "oauth", "jwt", "cors", "ssl",
  "dns", "json", "yaml", "env", "config", "serverless", "edge", "cdn", "cache", "microservices",
  "monolith", "kubernetes", "container", "devops", "terraform", "aws", "gcp", "azure", "s3", "lambda",
  "postgres", "redis", "api", "sdk", "webhook", "endpoint", "middleware", "latency", "uptime", "scale",
  "observability", "incident", "postmortem", "oncall", "telemetry", "analytics", "seo", "accessibility", "responsive", "changelog",
  "pivot", "disrupt", "unicorn", "runway", "valuation", "seed", "mvp", "pmf", "growth", "hustle",
  "grind", "founder", "cofounder", "investor", "pitch", "deck", "accelerator", "incubator", "bootstrap", "arr",
  "mrr", "churn", "retention", "onboarding", "activation", "funnel", "cohort", "iterate", "sprint", "standup",
  "backlog", "roadmap", "okrs", "kpis", "synergy", "leverage", "moat", "flywheel", "remote", "async",
  "hybrid", "wework", "sf", "soma", "hacker", "principles", "network", "burn", "mentor", "mentorship",
  "networking", "brand", "bandwidth", "humbled", "blessed", "grateful", "thrilled", "passionate", "authentic", "vulnerable",
  "viral", "clout", "girlboss", "rizz", "innovate", "slack", "notion", "figma", "linear", "stripe",
  "ai", "llm", "gpt", "transformer", "embedding", "vector", "rag", "prompt", "prompting", "token",
  "inference", "gpu", "cuda", "pytorch", "claude", "chatgpt", "agent", "agentic", "autonomous", "copilot",
  "assistant", "chatbot", "hallucination", "alignment", "safety", "interpretability", "agi", "superintelligence", "sentient", "model",
  "context", "checkpoint", "weights", "parameters", "dataset", "benchmark", "eval", "sandbox", "opensource", "multimodal",
  "reasoning", "orchestration", "distillation", "quantization", "grounding", "retrieval", "compute", "cluster", "scaling", "finetune",
  "pretraining", "throughput", "anthropic", "openai", "gemini", "llama", "mistral", "deepseek", "qwen", "grok",
  "opus", "sonnet", "haiku", "mcp", "subagent", "toolcall", "sysprompt", "jailbreak", "guardrails", "temperature",
  "claudecode", "v0", "n8n", "cody", "kiro", "amp", "antigravity", "junie", "roo", "openrouter",
  "cursor", "windsurf", "codex", "devin", "aider", "cline", "zed", "warp", "replit", "bolt",
  "lovable", "perplexity", "midjourney", "ollama", "huggingface", "langchain", "llamaindex", "pinecone", "supabase", "railway",
  "vibecoding", "autocomplete", "tabtab", "diff", "changeset", "worktree", "bisect", "stash", "cherrypick", "squash",
  "ngmi", "wagmi", "gmi", "cope", "seethe", "based", "cringe", "mid", "ratio", "cooked",
  "goated", "npc", "delulu", "brainrot", "yapping", "touchgrass", "doomscroll", "degen", "yolo", "shill",
  "moonshot", "rugpull", "zerosum", "asymmetric", "convexity", "optionality", "tailwinds", "headwinds", "greenfield", "brownfield",
  "yc", "ycombinator", "demoday", "batchmate", "safe", "postmoney", "preseed", "seriesa", "termsheet", "dilution",
  "liquidation", "convertible", "traction", "defensibility", "wedge", "b2b", "saas", "gtm", "icp", "cac",
  "ltv", "nrr", "burnmultiple", "downround", "bridge", "ramen", "profitable", "doordash", "airbnb", "stealth",
  "alpha", "beta", "waitlist", "invite", "founderled", "handwavy", "directionally", "nonlinear", "compounding", "unbundling",
  "bookface", "tc", "rsus", "vesting", "cliff", "refresher", "blind", "leetcode", "levels", "offer",
  "dropout", "deferred", "gapyear", "dorm", "hackathon", "warmintro", "officehours", "groupchat", "batch", "cracked",
  "fireship", "theprimeagen", "t3dotgg", "networkchuck", "lexfridman", "mkbhd", "karpathy", "swyx", "levelsio", "garrytan",
  "matthewberman", "cleoabram", "pg", "sama", "dario", "twitch", "shorts", "podcast", "subscribe", "algorithm",
  // The names on every billboard between SFO and the city.
  "sierra", "glean", "clay", "decagon", "harvey", "cognition", "mercor", "ramp", "rippling", "sardine",
  "vanta", "databricks", "snowflake", "groq", "cerebras", "modal", "together", "fireworks", "baseten", "elevenlabs",
  "suno", "synthesia", "browserbase", "wandb", "retool", "writer", "abridge", "anysphere", "sfo", "billboard",
  "sora", "veo", "descript", "granola", "attio", "mintlify", "resend", "clerk", "neon", "turso",
] as const;

/**
 * Multi-word entries. A space submits a word, so these are pushed as
 * consecutive words rather than shuffled into the single-token pool — the
 * point of a phrase is that it arrives whole.
 */
const PHRASES = [
  "posted it on bookface",
  "tc or gtfo",
  "we are so back",
  "it is so over",
  "ngmi without evals",
  "just ship it",
  "do things that dont scale",
  "make something people want",
  "default alive",
  "founder mode",
  "the moat is distribution",
  "just use cursor",
  "chatgpt wrapper",
  "one more prompt",
  "vibe coded the whole thing",
  "dropped out for this",
  "deferred my internship",
  "asked for a warm intro",
  "shipped it from the dorm",
  "the model is the product",
  "own your models",
  "own your nines",
  "saw it on a billboard",
  "now hiring engineers",
] as const;

/** Roughly how often a generated slot starts a phrase instead of a word. */
const PHRASE_CHANCE = 0.12;

/**
 * Time-mode tests have no natural end, so they generate a buffer that a fast
 * typist will not exhaust rather than trying to predict a word count.
 */
export const TIME_MODE_BUFFER = 240;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

/**
 * Picks `count` words at random, occasionally dropping in a whole phrase, and
 * never repeating a word back to back. An immediate repeat is the one pattern
 * that reliably reads as a bug rather than as randomness.
 */
export function generateWords(count: number): string[] {
  const words: string[] = [];
  let previous = "";

  while (words.length < count) {
    if (Math.random() < PHRASE_CHANCE) {
      const phrase = pick(PHRASES).split(" ");
      // Skipped rather than truncated: half a phrase is just noise.
      if (words.length + phrase.length <= count && phrase[0] !== previous) {
        words.push(...phrase);
        previous = phrase[phrase.length - 1] as string;
        continue;
      }
    }

    const word = pick(COMMON_WORDS);
    if (word === previous) continue;
    words.push(word);
    previous = word;
  }

  return words;
}
