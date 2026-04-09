// ── Free AI Setup Guide – All mock data ──

export type SetupPath = "local" | "cloud" | "gpu";

export interface PathOption {
  id: SetupPath;
  title: string;
  tagline: string;
  icon: string;
  bestFor: string[];
  cost: string;
  setupTime: string;
  privacy: string;
  hardware: string;
  assistant: string;
}

export const paths: PathOption[] = [
  {
    id: "local",
    title: "Local Model",
    tagline: "No subscription, no data leaving your machine.",
    icon: "HardDrive",
    bestFor: ["Privacy", "Offline work", "Decent laptop or desktop"],
    cost: "$0",
    setupTime: "10–20 min",
    privacy: "Full privacy",
    hardware: "16 GB RAM recommended",
    assistant: "Claude Code → Ollama",
  },
  {
    id: "cloud",
    title: "Free Cloud API",
    tagline: "Fastest way to begin.",
    icon: "Cloud",
    bestFor: ["Quick start", "Weak hardware", "Convenience"],
    cost: "$0 (free tier)",
    setupTime: "2–5 min",
    privacy: "Prompts may be logged",
    hardware: "Any machine",
    assistant: "Claude Code → Provider API",
  },
  {
    id: "gpu",
    title: "GPU Rental",
    tagline: "Small spend, big jump in capability.",
    icon: "Cpu",
    bestFor: ["Heavy workloads", "Larger models", "Hackathon crunch"],
    cost: "$0.15–$0.80/hr",
    setupTime: "15–30 min",
    privacy: "You control the instance",
    hardware: "Remote GPU (4090, A100, etc.)",
    assistant: "Claude Code → Remote Ollama",
  },
];

export interface LocalModel {
  name: string;
  param: string;
  bestFor: string;
  hardware: string;
  speed: string;
  toolCalling: string;
  recommended?: boolean;
  ollama: string;
}

export const localModels: LocalModel[] = [
  {
    name: "Qwen2.5-Coder",
    param: "7B / 14B / 32B",
    bestFor: "Code generation & editing",
    hardware: "8–32 GB RAM",
    speed: "Fast (7B)",
    toolCalling: "Good",
    recommended: true,
    ollama: "ollama pull qwen2.5-coder:7b",
  },
  {
    name: "Llama 3.1",
    param: "8B / 70B",
    bestFor: "General + tool calling",
    hardware: "8–64 GB RAM",
    speed: "Fast (8B)",
    toolCalling: "Excellent",
    recommended: true,
    ollama: "ollama pull llama3.1:8b",
  },
  {
    name: "DeepSeek-Coder-V2",
    param: "16B / 236B",
    bestFor: "Complex reasoning",
    hardware: "16–128 GB RAM",
    speed: "Moderate",
    toolCalling: "Good",
    ollama: "ollama pull deepseek-coder-v2:16b",
  },
  {
    name: "Codestral",
    param: "22B",
    bestFor: "Long context code",
    hardware: "16–32 GB RAM",
    speed: "Moderate",
    toolCalling: "Good",
    ollama: "ollama pull codestral:22b",
  },
  {
    name: "Phi-4",
    param: "3.8B",
    bestFor: "Lightweight & fast",
    hardware: "4–8 GB RAM",
    speed: "Very fast",
    toolCalling: "Basic",
    ollama: "ollama pull phi4",
  },
];

export interface SetupStep {
  step: number;
  title: string;
  description: string;
  command?: string;
  time: string;
}

export const localSetupSteps: SetupStep[] = [
  { step: 1, title: "Install Ollama", description: "Download from ollama.com and install for your OS.", command: "curl -fsSL https://ollama.com/install.sh | sh", time: "2 min" },
  { step: 2, title: "Start the server", description: "Ollama runs a local API server on port 11434.", command: "ollama serve", time: "10 sec" },
  { step: 3, title: "Pull a model", description: "Download a coding model. Qwen2.5-Coder 7B is a great start.", command: "ollama pull qwen2.5-coder:7b", time: "5–10 min" },
  { step: 4, title: "Connect Claude Code", description: "Set environment variables so Claude Code uses your local model.", command: `export ANTHROPIC_BASE_URL=http://localhost:11434/v1\nexport ANTHROPIC_AUTH_TOKEN=ollama\nexport ANTHROPIC_API_KEY=ollama`, time: "30 sec" },
  { step: 5, title: "Set context window", description: "Adjust the context window for better results with larger files.", command: `export ANTHROPIC_SMALL_FAST_MODEL=qwen2.5-coder:7b\nexport CLAUDE_CODE_MAX_TOKENS=8192`, time: "10 sec" },
  { step: 6, title: "Test a prompt", description: "Open Claude Code and send a test prompt to verify the connection.", command: "claude", time: "1 min" },
];

export interface CloudProvider {
  name: string;
  baseUrl: string;
  envVar: string;
  model: string;
  freeNote: string;
  privacyNote: string;
  bestFor: string;
  badge?: string;
}

export const cloudProviders: CloudProvider[] = [
  {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    envVar: "OPENROUTER_API_KEY",
    model: "meta-llama/llama-3.1-8b-instruct:free",
    freeNote: "Many free models available",
    privacyNote: "Prompts may be logged by upstream providers",
    bestFor: "Widest model selection",
    badge: "Most flexible",
  },
  {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    envVar: "GROQ_API_KEY",
    model: "llama-3.1-8b-instant",
    freeNote: "Generous free tier, very fast inference",
    privacyNote: "Prompts may be used for improvement",
    bestFor: "Fastest inference speed",
    badge: "Fastest",
  },
  {
    name: "Google AI Studio",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    envVar: "GOOGLE_API_KEY",
    model: "gemini-2.0-flash",
    freeNote: "Free tier with rate limits",
    privacyNote: "Data used for model improvement on free tier",
    bestFor: "Large context windows",
  },
  {
    name: "Mistral (Codestral)",
    baseUrl: "https://codestral.mistral.ai/v1",
    envVar: "MISTRAL_API_KEY",
    model: "codestral-latest",
    freeNote: "Free for code via Codestral endpoint",
    privacyNote: "Check Mistral's data policy",
    bestFor: "Dedicated code model",
  },
];

export interface GpuProvider {
  name: string;
  pricePerHour: string;
  gpu: string;
  bestFor: string;
  billing: string;
  setupFriction: string;
  recommended?: boolean;
}

export const gpuProviders: GpuProvider[] = [
  { name: "RunPod", pricePerHour: "~$0.20/hr", gpu: "RTX 4090", bestFor: "Hackathons", billing: "Per-second", setupFriction: "Low", recommended: true },
  { name: "Vast.ai", pricePerHour: "~$0.15/hr", gpu: "RTX 3090+", bestFor: "Budget runners", billing: "Per-hour", setupFriction: "Low", recommended: true },
  { name: "Lambda Labs", pricePerHour: "~$0.50/hr", gpu: "A10G / A100", bestFor: "Serious workloads", billing: "Per-hour", setupFriction: "Medium" },
  { name: "Paperspace", pricePerHour: "~$0.45/hr", gpu: "A4000+", bestFor: "ML workflows", billing: "Per-hour", setupFriction: "Medium" },
  { name: "Hostinger VPS", pricePerHour: "~$7/mo", gpu: "N/A (CPU)", bestFor: "Always-on light tasks", billing: "Monthly", setupFriction: "Low" },
];

export interface PromptExample {
  goal: string;
  path: SetupPath;
  model: string;
  expectedQuality: string;
}

export const promptExamples: PromptExample[] = [
  { goal: "Explain a codebase", path: "cloud", model: "Google AI Studio (large context)", expectedQuality: "High" },
  { goal: "Generate a React component", path: "local", model: "Qwen2.5-Coder 7B", expectedQuality: "High" },
  { goal: "Fix a TypeScript bug", path: "local", model: "Qwen2.5-Coder 14B", expectedQuality: "High" },
  { goal: "Review a smart contract", path: "local", model: "Llama 3.1 8B", expectedQuality: "Good" },
  { goal: "Summarize a repo", path: "cloud", model: "OpenRouter / Groq", expectedQuality: "Good" },
  { goal: "Build a CLI script", path: "local", model: "Qwen2.5-Coder 7B", expectedQuality: "High" },
];

export interface TroubleshootEntry {
  symptom: string;
  cause: string;
  fix: string;
  fallback: string;
}

export const troubleshooting: TroubleshootEntry[] = [
  { symptom: "Ollama not running", cause: "Server not started or port conflict", fix: "Run `ollama serve` and check port 11434", fallback: "Use a free cloud API temporarily" },
  { symptom: "Model download too slow", cause: "Slow internet or large model", fix: "Try a smaller variant (e.g., 7B instead of 14B)", fallback: "Use Groq for instant access" },
  { symptom: "Claude Code not connecting", cause: "Wrong ANTHROPIC_BASE_URL", fix: "Verify the URL matches your provider exactly", fallback: "Double-check env vars are exported" },
  { symptom: "Wrong base URL format", cause: "Missing /v1 suffix or typo", fix: "Ensure URL ends with /v1 for OpenAI-compat", fallback: "Copy from the provider tab above" },
  { symptom: "Invalid API key", cause: "Key not set or expired", fix: "Re-generate from provider dashboard", fallback: "Try a different free provider" },
  { symptom: "Context window too small", cause: "Default limits too low", fix: "Set CLAUDE_CODE_MAX_TOKENS=8192 or higher", fallback: "Use a model with larger default context" },
  { symptom: "GPU SSH won't connect", cause: "Wrong IP or key pair", fix: "Copy the SSH command from the provider dashboard", fallback: "Re-deploy instance" },
  { symptom: "Provider rate limit hit", cause: "Free-tier cap exceeded", fix: "Wait, or switch to a different free provider", fallback: "Use local Ollama as a backup" },
];

export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqs: FaqEntry[] = [
  { question: "Which setup should I choose?", answer: "Start local if privacy matters. Start cloud if you need speed. Rent a GPU if your laptop can't handle the model you need." },
  { question: "Can I use this on a weak laptop?", answer: "Yes — use a free cloud API or rent a GPU. You only need a browser and a terminal." },
  { question: "Is local setup fully private?", answer: "Yes. With Ollama, all inference runs on your machine. No data leaves your network." },
  { question: "Are free cloud APIs really free?", answer: "Yes, within rate limits. Some providers cap requests per minute or day. Check each provider's free-tier policy." },
  { question: "Why rent a GPU at all?", answer: "When you need a 70B model or your laptop has less than 8 GB RAM. A few dollars covers a full hackathon weekend." },
  { question: "Can I switch paths later?", answer: "Absolutely. Claude Code just needs a base URL change. Your workflow stays the same." },
  { question: "What model should I start with?", answer: "Qwen2.5-Coder 7B for local. Llama 3.1 8B on Groq for cloud. Both are fast and capable." },
  { question: "Does Claude Code work with all of these?", answer: "Yes. Claude Code supports any OpenAI-compatible endpoint. All listed providers and Ollama are compatible." },
];

export interface RoadmapItem {
  title: string;
  status: "done" | "in-progress" | "planned";
}

export const roadmap: RoadmapItem[] = [
  { title: "Ollama + Claude Code integration guide", status: "done" },
  { title: "Free cloud provider presets", status: "done" },
  { title: "GPU rental comparison", status: "done" },
  { title: "One-click Claude Code templates", status: "in-progress" },
  { title: "Interactive GPU cost calculator", status: "in-progress" },
  { title: "More local model recommendations", status: "planned" },
  { title: "Hackathon-specific starter kits", status: "planned" },
  { title: "Model comparison auto-updates", status: "planned" },
];

export interface ResourceCard {
  title: string;
  description: string;
  why: string;
  url: string;
}

export const resources: ResourceCard[] = [
  { title: "Ollama Docs", description: "Official docs for installing and running local models.", why: "Your starting point for local AI.", url: "https://ollama.com" },
  { title: "Claude Code Docs", description: "Learn how to configure Claude Code with custom endpoints.", why: "Connect any provider to your workflow.", url: "https://docs.anthropic.com/claude-code" },
  { title: "OpenRouter", description: "Access hundreds of models through one API.", why: "Widest selection of free models.", url: "https://openrouter.ai" },
  { title: "Groq Console", description: "Ultra-fast inference on free tier.", why: "Fastest free API available.", url: "https://console.groq.com" },
  { title: "RunPod", description: "Rent GPUs by the second for ML and inference.", why: "Best for short hackathon bursts.", url: "https://runpod.io" },
  { title: "Vast.ai", description: "GPU marketplace with competitive pricing.", why: "Cheapest GPU rental option.", url: "https://vast.ai" },
];

export interface AudienceCard {
  label: string;
  benefit: string;
  hardware: string;
  recommendation: SetupPath;
}

export const audiences: AudienceCard[] = [
  { label: "Local-first developers", benefit: "Full privacy, zero recurring cost", hardware: "16+ GB RAM", recommendation: "local" },
  { label: "Cloud-first builders", benefit: "Start in minutes, no downloads", hardware: "Any machine", recommendation: "cloud" },
  { label: "Hackathon teams", benefit: "Fast setup, iterate quickly", hardware: "Varies", recommendation: "cloud" },
  { label: "Budget-conscious hackers", benefit: "Build without spending", hardware: "8+ GB RAM", recommendation: "local" },
  { label: "GPU fallback users", benefit: "Run bigger models affordably", hardware: "Remote GPU", recommendation: "gpu" },
];

export const heroChips = ["Ollama", "Claude Code", "OpenRouter", "Groq", "Google AI Studio", "RunPod", "Vast.ai"];

export const connectionSnippets: Record<string, { envVars: string; note: string; bestFor: string }> = {
  "Local Ollama": {
    envVars: `export ANTHROPIC_BASE_URL=http://localhost:11434/v1
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_API_KEY=ollama
export ANTHROPIC_SMALL_FAST_MODEL=qwen2.5-coder:7b`,
    note: "Full privacy. All inference stays on your machine.",
    bestFor: "Privacy & offline work",
  },
  OpenRouter: {
    envVars: `export ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1
export ANTHROPIC_API_KEY=sk-or-...your-key...`,
    note: "Wide model selection. Some free models available.",
    bestFor: "Flexibility & model variety",
  },
  Groq: {
    envVars: `export ANTHROPIC_BASE_URL=https://api.groq.com/openai/v1
export ANTHROPIC_API_KEY=gsk_...your-key...`,
    note: "Extremely fast inference. Generous free tier.",
    bestFor: "Speed",
  },
  "Google AI Studio": {
    envVars: `export ANTHROPIC_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
export ANTHROPIC_API_KEY=...your-google-key...`,
    note: "Large context windows. Free tier with rate limits.",
    bestFor: "Large codebases",
  },
  "Mistral Codestral": {
    envVars: `export ANTHROPIC_BASE_URL=https://codestral.mistral.ai/v1
export ANTHROPIC_API_KEY=...your-mistral-key...`,
    note: "Dedicated code model. Free for coding use.",
    bestFor: "Code-specific tasks",
  },
};
