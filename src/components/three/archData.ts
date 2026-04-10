export interface ArchNode {
  id: string;
  label: string;
  description: string;
  detail: string;
  keyFact: string;
  siteSection?: string;
  position: [number, number, number];
  type: "input" | "brain" | "lane" | "tool" | "renderer" | "output" | "memory" | "addon" | "guard" | "planned" | "cognitive" | "model-seat" | "crsis" | "partial";
}

export interface ArchEdge {
  from: string;
  to: string;
}

export const NODES: ArchNode[] = [
  // Input layer (left)
  {
    id: "raw_input",
    label: "User Input",
    description: "Voice or text input enters the system. Could come from local microphone, Discord, or any addon bridge.",
    detail: "Herald is source-agnostic. A voice utterance from a local mic, a text message from Discord, or a programmatic API call from an addon all enter through the same pipeline. The input source is tagged but never changes the routing logic.",
    keyFact: "Any source, same pipeline",
    position: [-12, 0, 0],
    type: "input",
  },
  {
    id: "ingress_hub",
    label: "Ingress Hub",
    description: "Accepts raw events from all sources. Single entry point. No bypass allowed.",
    detail: "The ingress hub is the only door into Herald. Every input, regardless of origin, must pass through this single checkpoint. Addons can register new input bridges, but those bridges must deliver events here. There is no backdoor, no fast-path, no alternative entry.",
    keyFact: "Single entry point, zero bypass",
    siteSection: "/how-it-works",
    position: [-8, 0, 0],
    type: "brain",
  },
  {
    id: "ingress_normalizer",
    label: "Normalizer",
    description: "Strips wake words, maps speaker identity to permission profile (owner/trusted/guest), produces IngressEnvelope.",
    detail: "The normalizer cleans raw input into a structured IngressEnvelope. Wake words are stripped, the speaker is identified and mapped to a permission profile (owner has full access, trusted has limited tool access, guest has read-only). The envelope carries the cleaned text, speaker profile, source metadata, and timestamp.",
    keyFact: "3 permission tiers: owner / trusted / guest",
    siteSection: "/how-it-works",
    position: [-4.5, 0, 0],
    type: "brain",
  },

  // Routing (center)
  {
    id: "prompt_dispatcher",
    label: "5-Stage Cascade",
    description: "Stage 1: Exact match. Stage 2: Strict Deterministic. Stage 3: Soft Deterministic. Stage 4: Semantic Embedding. Stage 5: Fallthrough.",
    detail: "Five stages run in strict sequence. Exact dictionary match (O(1)), strict pattern, soft synonyms, embedded search, then final fallthrough. Zero LLM inference.",
    keyFact: "3 tiers, first match wins, 0 LLM calls",
    siteSection: "/how-it-works",
    position: [-0.5, 0, 0],
    type: "brain",
  },

  // Lanes (split)
  {
    id: "realtime_lane",
    label: "Realtime Lane",
    description: "Synchronous execution for quick queries. <100ms. Handles greetings, time, status, memory recall, tool calls. No LLM needed.",
    detail: "The fast path. Greetings, time queries, status checks, and simple tool calls execute synchronously in the calling thread. Memory reads happen here. The response compiler can often assemble a complete fact packet without any LLM involvement, producing <100ms end-to-end latency.",
    keyFact: "<100ms end-to-end",
    siteSection: "/pattern",
    position: [3.5, 3, 0],
    type: "lane",
  },
  {
    id: "bg1_queue",
    label: "BG1 Queue",
    description: "FIFO queue for heavy tasks. Max 1 active + 1 queued. TTL-based expiry. SHA256 idempotency dedup.",
    detail: "Heavy tasks (research, code analysis, vision) enter this FIFO queue. Capacity is deliberately limited: one active job plus one queued. SHA256 hashing deduplicates identical requests. TTL-based expiry prevents stale jobs from clogging the system. Admission control gates access to prevent overload.",
    keyFact: "Max 1 active + 1 queued",
    position: [3, -3, 0],
    type: "lane",
  },
  {
    id: "bg1_worker",
    label: "BG1 Worker",
    description: "Daemon thread executing heavy tasks. Routes to code or vision specialist. Updates job status at 15%, 60%, 95%.",
    detail: "A dedicated daemon thread picks jobs from BG1 Queue and routes them to the appropriate specialist (code analysis, web research, vision processing). Progress updates are emitted at 15%, 60%, and 95% so the user gets real-time feedback. The worker reports results back to the response compiler when complete.",
    keyFact: "Progress updates at 15%, 60%, 95%",
    position: [6, -3, 0],
    type: "lane",
  },

  // Tools
  {
    id: "tool_orchestrator",
    label: "Tool Orchestrator",
    description: "Dispatches tool calls with timing, error handling, and safety flags. Returns ToolResultEnvelope.",
    detail: "The tool orchestrator is a deterministic dispatcher. It receives a tool name and arguments from the lane, validates against safety flags, executes the tool, records timing and error state, and returns a structured ToolResultEnvelope. The LLM never selects tools. The code decides which tool to call based on the dispatcher's classification.",
    keyFact: "Deterministic tool dispatch, LLM never selects",
    siteSection: "/how-it-works",
    position: [6, 3, 0],
    type: "tool",
  },

  // Compilation & Rendering (right)
  {
    id: "response_compiler",
    label: "Response Compiler",
    description: "Assembles facts into a frozen ResponsePacket. Merges user text, tool summaries, memory items, job status. Max 384 tokens.",
    detail: "The compiler gathers every relevant fact: the original user text, tool results, memory items, job progress, and system status. These are merged into a frozen, immutable ResponsePacket with explicit constraints (tone, length hint, max tokens). This packet is the wall between the deterministic brain and the LLM. Nothing crosses it except pre-assembled facts.",
    keyFact: "Max 384 tokens, frozen immutable packet",
    siteSection: "/how-it-works",
    position: [9.5, 0, 0],
    type: "brain",
  },
  {
    id: "cllm_renderer",
    label: "CLLM Renderer",
    description: "THE INVENTION. Receives immutable fact packet. Returns 1 LLM extraction call. Falls back to deterministic bare-bones rendering if missing.",
    detail: "The renderer receives the frozen ResponsePacket and rephrases the facts into natural speech using Kokoro ONNX. If the LLM failed, fallback produces the same factual answer without natural polish.",
    keyFact: "1 LLM call, immutable input, deterministic fallback",
    siteSection: "/how-it-works",
    position: [13.5, 0, 0],
    type: "renderer",
  },
  {
    id: "speech_formatter",
    label: "Speech Formatter",
    description: "Strips internal tokens (user:, tool:, memory:). Redacts file paths. Cleans whitespace. Produces voice-ready text.",
    detail: "The last cleaning pass before output. Internal tokens (user:, tool:, memory: prefixes) are stripped. File paths and system internals are redacted to prevent information leakage. Whitespace is normalized and the text is validated as voice-ready. The output is clean, safe, and ready for any sink.",
    keyFact: "Strips internal tokens, redacts paths",
    position: [17, 0, 0],
    type: "brain",
  },

  // Output
  {
    id: "output_coordinator",
    label: "Output Coordinator",
    description: "Routes rendered text to SD.wait() audio output and Discord. TTS relies heavily on Kokoro initialization.",
    detail: "On Linux, fallback pushes to system default device using sd.wait() since PortAudio causes concurrent lock issues.",
    keyFact: "5-level fallback chain, never silent",
    position: [20.5, 0, 0],
    type: "output",
  },

  // Supporting systems (floating)
  {
    id: "memory_service",
    label: "Memory",
    description: "SQLite-backed fact storage with WAL mode. Confidence-gated writes (threshold 0.75). Retention purging. Backup & rollback.",
    detail: "Uses SQLite in WAL mode for concurrent reads during tool execution. Every write must exceed a confidence threshold of 0.75 to prevent speculative or low-quality facts from persisting. Automatic retention purging removes stale facts based on age and access frequency. Full backup and rollback support allows CRSIS to safely experiment with memory changes.",
    keyFact: "Confidence >= 0.75 required for writes",
    siteSection: "/skeptic",
    position: [1, -6.5, 2],
    type: "memory",
  },
  {
    id: "admission_control",
    label: "Admission Control",
    description: "Gates BG1 access. Checks active jobs and queue length. Rejects when busy. Prevents overload.",
    detail: "A deterministic gatekeeper for the background worker system. Before any heavy task enters BG1 Queue, admission control checks: is there a job already running? Is the queue full? Has this exact request been submitted recently (dedup)? If any check fails, the request is rejected with an immediate, informative response rather than silently queuing.",
    keyFact: "Prevents overload, dedup check",
    position: [0.5, -4, -2],
    type: "guard",
  },
  {
    id: "guardrails",
    label: "Guardrails",
    description: "Path safety (no workspace escapes). Network guard (blocks private IPs, dangerous schemes). Confirmation required for destructive ops.",
    detail: "Multi-layer safety enforcement. Path safety prevents tools from accessing files outside the workspace. Network guard blocks requests to private IPs, localhost, and dangerous URI schemes. Destructive operations (file deletion, system commands) require explicit owner confirmation. These guards run in deterministic code, not LLM judgment.",
    keyFact: "Path + network + destructive op guards",
    siteSection: "/skeptic",
    position: [5, 6, -2],
    type: "guard",
  },
  {
    id: "addon_registry",
    label: "Addon System",
    description: "Extensions register tools, bridges, sinks, channels, commands. Cannot bypass ingress or output coordination. Static call graph enforced.",
    detail: "The addon system allows extensions to register new tools, input bridges, output sinks, communication channels, and slash commands. But addons operate within the static call graph: they cannot bypass ingress normalization, skip guardrails, or inject directly into the output. The architecture is extensible without being compromisable.",
    keyFact: "Extensible, never bypassable",
    siteSection: "/skeptic",
    position: [-5, 5, 3],
    type: "addon",
  },

  // ── Planned Tasks (G–R) — reclassified by implementation status ──

  // G: BUILT — fact_anchoring.py
  {
    id: "built_g",
    label: "G: Fact Anchoring",
    description: "Output gate for the CLLM Renderer. Extracts facts into numbered list, builds anchored system prompt, gates output for hedge/escape markers.",
    detail: "Implemented in world_model/fact_anchoring.py. Three layers of hallucination prevention: fact extraction flattens the ResponsePacket into enumerated atomic facts, the anchored system prompt locks scope to only those facts, and an output gate scans for hedge markers ('I think', 'probably') and escape markers ('based on my knowledge'). Double gate failure triggers deterministic fallback.",
    keyFact: "Enumerated facts + scope lock + output gate",
    siteSection: "/roadmap",
    position: [14, 3, 4],
    type: "brain",
  },
  // H: BUILT — memory_service.py contradiction guard
  {
    id: "built_h",
    label: "H: Contradiction Guard",
    description: "Pre-save contradiction check in Memory. Blocks inserts that contradict existing facts for the same key using lexical negation detection.",
    detail: "Implemented in brain_core/memory_service.py. Before any fact is saved, the _is_contradiction guard queries existing values and compares using negation pairs (yes/no, true/false, enabled/disabled). Contradictions emit a memory_contradiction event instead of inserting.",
    keyFact: "Lexical negation pairs block conflicting facts",
    siteSection: "/roadmap",
    position: [-1, -9, 5],
    type: "memory",
  },
  // I: BUILT — memory_service.py confidence decay
  {
    id: "built_i",
    label: "I: Confidence Decay",
    description: "Exponential decay with 30-day half-life. Old facts lose effective confidence over time. retrieve() filters by decayed score.",
    detail: "Implemented in brain_core/memory_service.py (_decayed_confidence). Uses a 30-day half life. A fact saved at confidence 0.9 thirty days ago decays to ~0.45 effective confidence. Facts falling below 0.75 are filtered out during standard retrieval.",
    keyFact: "30-day half-life, exponential decay",
    siteSection: "/roadmap",
    position: [3, -9, 5],
    type: "memory",
  },
  // J: BUILT - Intent Miss Logging
  {
    id: "built_j",
    label: "J: Intent Miss Logging",
    description: "Logs unmatched inputs as intent_miss events into an observability JSONL for CRSIS processing.",
    detail: "Hooked directly into prompt_dispatcher.py. When an utterance falls through all matching tiers without triggering a tool, IntentMissLogger persists it safely to disk. Aggregated into the health dashboard.",
    keyFact: "Every miss logged for CRSIS pattern detection",
    siteSection: "/roadmap",
    position: [-2, 3.5, 4],
    type: "crsis",
  },
  // K: BUILT — crsis/decision_quality.py (95 lines)
  {
    id: "built_k",
    label: "K: Quality Scoring",
    description: "Every turn scored for routing confidence and tool result quality. DecisionQualityLogger tracks outcomes. Feeds CRSIS analysis.",
    detail: "Implemented in crsis/decision_quality.py. DecisionQualityRecord tracks turn_id, routing_confidence, tool_result_quality (0.0-1.0), and outcome (success/partial/failure). DecisionQualityLogger accumulates records for CRSIS pattern detection.",
    keyFact: "Per-turn quality tracking, feeds CRSIS",
    siteSection: "/crsis",
    position: [16, 3, 4],
    type: "crsis",
  },
  // L: BUILT — crsis/satisfaction_detector.py (full correction detection)
  {
    id: "built_l",
    label: "L: Correction Hook",
    description: "Detects correction phrases ('no,', 'not that', 'that\u2019s wrong'), re-asks, acceptance, and abandonment signals. Built into satisfaction_detector.py.",
    detail: "Implemented in crsis/satisfaction_detector.py. Detects four signal types: correction (user corrects response), re_ask (user repeats question), acceptance (user continues), and abandonment (user leaves). Wired into main.py turn loop.",
    keyFact: "4 signal types: correction, re-ask, acceptance, abandonment",
    siteSection: "/crsis",
    position: [-8, 3.5, 4],
    type: "crsis",
  },
  // M: BUILT - Linux App Desktop Ops
  {
    id: "built_m",
    label: "M: App Desktop Ops",
    description: "Native Wayland/X11 wrappers to execute safe Desktop OS application control.",
    detail: "Built natively in app_ops.py. Fully replaces Windows COM with subprocess calls to xdotool, xdg-open, and wmctrl. Allows safe allowed-app launching, focusing, and closing directly from the pipeline.",
    keyFact: "Native X11/Wayland wrapper integrations",
    siteSection: "/roadmap",
    position: [8.5, -5.5, 5],
    type: "tool",
  },
  // N: BUILT — specialist_vision.py fully multimodal
  {
    id: "built_n",
    label: "N: Vision Payloads",
    description: "Screen capture and vision specialist routing. Captures screens natively and sends multimodal data.",
    detail: "Fully implemented in specialists/specialist_vision.py. Captures screens and active windows, handles base64 encoding, and passes fully prepared image blobs to the Ollama vision model.",
    keyFact: "Multimodal Ollama payload integration",
    siteSection: "/roadmap",
    position: [5, -5.5, 5],
    type: "tool",
  },
  // O: BUILT — memory_service.py integrates semantic matching with confidence decay
  {
    id: "built_o",
    label: "O: RAG Retrieval",
    description: "Semantic search utilizing embedding models with time decay adjustments.",
    detail: "Fully implemented. MemoryService uses cosine similarity coupled with confidence decay to produce an effective RAG ranking. Passed to the ResponseCompiler seamlessly.",
    keyFact: "Cosine sim x confidence decay ranking",
    siteSection: "/roadmap",
    position: [1, -11, 6],
    type: "memory",
  },
  // P: BUILT — pocket_memory.py has full provenance tracking
  {
    id: "built_p",
    label: "P: Memory Provenance",
    description: "Every memory fact tagged with provenance: confidence, provenance_type, source, and protection_level. Implemented in PocketMemory.",
    detail: "Implemented in pocket_memory.py (643 lines). PocketSlot and PocketLink have confidence, provenance_type, and source fields. Protection levels (canonical vs dynamic) prevent accidental modification of system facts. Full traceability from fact to source.",
    keyFact: "Full provenance on every slot and link",
    siteSection: "/skeptic",
    position: [-2.5, -11, 6],
    type: "crsis",
  },
  // Q: BUILT — engine.py supports RuleVersion and crsis_rules.jsonl 
  {
    id: "built_q",
    label: "Q: Rule Versioning",
    description: "Full rule history tracking and rollback functionality via File-level backup and JSONL.",
    detail: "Fully implemented in crsis/engine.py. CRSISEngine stores every rule modification as a distinct record. Provides full snapshot rollbacks using crsis_rules.jsonl.",
    keyFact: "Versioned crsis_rules.jsonl with rollback",
    siteSection: "/roadmap",
    position: [3, 7.5, 4],
    type: "crsis",
  },
  // R: BUILT - Health Dashboard Aggregation
  {
    id: "built_r",
    label: "R: Health Dashboard",
    description: "Aggregates overall runtime state and surfaces top intent misses in a comprehensive JSON dump.",
    detail: "Implemented in health_report.py. Collects top 5 intent miss patterns, records active addon faults, and verifies degrade modes to present the overall health block to CLI users.",
    keyFact: "Terminal dashboard reporting",
    siteSection: "/roadmap",
    position: [20, 3.5, 4],
    type: "crsis",
  },

  // ── Additional Recently Built Infrastructure ──
  {
    id: "route_trace_logger",
    label: "Route Trace Logger",
    description: "Captures explicit 5-stage debug routing (Ingress, Normalize, Dispatch, Execute, Output) and logs to jsonl for observability.",
    detail: "Implemented via brain_core/route_trace.py. Enables perfect visibility into the execution flow, tracking timing and transitions for the deterministic layers. Indispensible for tracing cognitive logic misses.",
    keyFact: "5-stage observability trace",
    siteSection: "/how-it-works",
    position: [-0.5, -4.5, -1],
    type: "brain",
  },
  {
    id: "bg1_narrator",
    label: "BG1 Narrator",
    description: "Provides intermittent voice updates for long-running background tasks. Runs in foreground while heavy loop spins in background.",
    detail: "Implemented in brain_core/bg1_narrator.py. Issues real-time TTS notifications at 15%, 60%, 95% progress preventing silent locks on user voice interactions.",
    keyFact: "Realtime narration for background delays",
    siteSection: "/pattern",
    position: [4.5, -1.5, 0],
    type: "lane",
  },
  {
    id: "discord_service",
    label: "Discord Service",
    description: "Runs continuous thread management, allowing asynchronous texting and fallback outputs.",
    detail: "Implemented as a core addon bridge connecting external inputs to the ingress hub. Also serves as a target for output_coordinator when the primary local-voice environment is unresponsive.",
    keyFact: "Addon bridge for raw_input",
    siteSection: "/how-it-works",
    position: [-7, 5, 2],
    type: "addon",
  },

  // ── CRSIS Infrastructure (Built) ──
  {
    id: "crsis_engine",
    label: "CRSIS Engine",
    description: "Core self-improvement loop orchestrator. Coordinates observe-analyze-propose-gate-apply cycle.",
    detail: "Implemented in crsis/engine.py. Orchestrates the full CRSIS loop: satisfaction detection, decision log analysis, proposal generation, human approval gating, and safe change application with rollback. Callable from main.py's JarvisRuntime.run_crsis_loop().",
    keyFact: "5-step self-improvement loop, human-gated",
    siteSection: "/crsis",
    position: [10, 6, 4],
    type: "crsis",
  },
  {
    id: "crsis_analyzer",
    label: "CRSIS Analyzer",
    description: "DecisionLogAnalyzer reads event logs and detects misrouting, empty tool results, and correction clusters. 219 lines.",
    detail: "Implemented in crsis/analyzer.py. Reads JSONL event logs and identifies patterns: which intents are misrouted, which tool results are empty, which renderer outputs get corrected. Feeds into the proposal generator.",
    keyFact: "Pattern detection on decision logs",
    siteSection: "/crsis",
    position: [7, 6, 5],
    type: "crsis",
  },
  {
    id: "crsis_proposer",
    label: "CRSIS Proposer",
    description: "Generates concrete improvement proposals: new phrases, threshold adjustments, synonym mappings. Three specialist proposers.",
    detail: "Implemented in crsis/proposer.py with three specialist proposers: PhraseProposer (new exact-match phrases), ThresholdProposer (classification threshold adjustments), SynonymProposer (synonym mappings). Each generates code-level changes.",
    keyFact: "3 proposer types: phrase, threshold, synonym",
    siteSection: "/crsis",
    position: [13, 6, 5],
    type: "crsis",
  },
  {
    id: "crsis_applier",
    label: "CRSIS Applier",
    description: "Applies approved changes atomically with backup. CodeModifier (352 lines) targets EXACT_INTENTS, HEAVY_PHRASES, synonym maps.",
    detail: "Implemented in crsis/applier.py (193 lines) and crsis/code_modifier.py (352 lines). Creates file backups before changes, applies modifications to Python dict/set literals, runs TestValidator after apply, and triggers RollbackManager if validation fails.",
    keyFact: "Atomic apply with backup + test + rollback",
    siteSection: "/crsis",
    position: [16, 6, 5],
    type: "crsis",
  },
  {
    id: "crsis_approval",
    label: "CRSIS Approval Gate",
    description: "ProposalQueue with human approval workflow. No change applies without explicit authorization. Default: require_approval=True.",
    detail: "Implemented in crsis/approval.py (135 lines). Proposals are queued and cannot be auto-applied when require_approval=True (default). Each proposal shows what changes, why, what evidence triggered it, and a rollback path.",
    keyFact: "Human gate, no silent self-modification",
    siteSection: "/crsis",
    position: [10, 9, 4],
    type: "crsis",
  },

  // ── Cognitive Layer (Concept D) ──
  {
    id: "deterministic_understanding",
    label: "Deterministic Understanding",
    description: "34-signal pattern matching before intent matching (31 booleans + 3 entity extractions). Name, age, address preference.",
    detail: "The cognitive layer runs in under 5ms. 31 boolean signals computed via lexical pattern matching plus 3 entity extractions. No embeddings, no vector search, no LLM. Entity extraction captures declared_name, declared_age, and declared_address_preference from user utterances.",
    keyFact: "34 signals (31 bool + 3 entity), 0 LLM calls",
    siteSection: "/cognitive-layer",
    position: [-2, 2, 3],
    type: "cognitive",
  },
  {
    id: "name_profile",
    label: "Name Profile",
    description: "Extracts user-declared names from utterances. Supports multi-word names, preserves title case.",
    detail: "NameProfile is called from deterministic_understanding.py to extract declared_name. Works with patterns like 'my name is X', 'I am X', 'call me X'. Handles aliases and nickname preferences.",
    keyFact: "Multi-word name extraction",
    siteSection: "/cognitive-layer",
    position: [-1, 4, 3],
    type: "cognitive",
  },
  {
    id: "pocket_memory",
    label: "PocketMemory",
    description: "643-line entity-slot-link graph memory. Protection levels: canonical vs dynamic.",
    detail: "PocketMemory stores facts as a graph: entities (self:jarvis, person:owner, tool:*), slots (key-value facts with confidence/provenance), and links (relationships). Canonical entities are protected from modification. Seed entities include self:jarvis, person:creator_james, person:creator_bxserkk, architecture:herald_skeptic.",
    keyFact: "Entity-slot-link graph, 643 lines",
    siteSection: "/skeptic",
    position: [1, -8, 4],
    type: "memory",
  },
  {
    id: "world_state",
    label: "World State",
    description: "Persistent structured model of everything the system knows about the world right now. Updated after every event.",
    detail: "Eight fields: user profile, current task stack, open background jobs, recent failures, device status, tool availability map, model availability map, and confidence ledger. Updated deterministically after every event. Read by every decision point. The system knows what it knows — and knows what it doesn't.",
    keyFact: "8 structured fields, updated every event",
    siteSection: "/world-model",
    position: [4, 8, -3],
    type: "cognitive",
  },
  {
    id: "state_builder",
    label: "State Builder",
    description: "Processes each event and applies deterministic updates to the world-state model. No LLM involved in state management.",
    detail: "After each tool result, user input, or system event, the state builder applies deterministic update rules to the world-state. State transitions are diffable and testable. The world-state is never modified by a model — only by code that processes grounded events.",
    keyFact: "Deterministic state transitions, zero LLM",
    siteSection: "/world-model",
    position: [0, 8, -2],
    type: "cognitive",
  },
  {
    id: "planner",
    label: "Planner",
    description: "Reads the world-state and decides what Esoteric v0.2 should do next. Structured state in, action plan out.",
    detail: "The planner reads the current world-state (task stack, failures, availability) and produces an action plan. Not an LLM reasoning about 'what should I do?' — code reading structured data and applying priority rules. The planner feeds into the existing 5-stage dispatcher.",
    keyFact: "Structured state in, action plan out",
    siteSection: "/world-model",
    position: [8, 8, -2],
    type: "cognitive",
  },
  {
    id: "evidence_store",
    label: "Evidence Store",
    description: "Stores grounded evidence: tool outputs, file reads, OCR results. Separate from beliefs. Only direct observations with provenance.",
    detail: "Every tool result, file read, and screen capture OCR is stored with full provenance: source, timestamp, and confidence. The evidence store never contains inferences or hunches — only direct observations. This is what the Judge checks claims against.",
    keyFact: "Only direct observations, full provenance",
    siteSection: "/world-model",
    position: [-3, 8, -4],
    type: "cognitive",
  },
  {
    id: "judge",
    label: "Judge / Verifier",
    description: "Checks outputs against the evidence store. Tags every claim as observed, recalled, inferred, or guessed. Evidence hierarchy enforced.",
    detail: "Before any output is finalized, the judge cross-references every claim against the evidence store. Claims with tool-output backing are tagged 'observed'. Claims from memory are 'recalled'. Reasoning chains are 'inferred'. Everything else is 'guessed'. Observed claims take priority in final output assembly. Disagreements are resolved by evidence, not by which answer sounds better.",
    keyFact: "4 claim categories, evidence hierarchy",
    siteSection: "/crsis",
    position: [12, 8, -3],
    type: "cognitive",
  },
  {
    id: "belief_state",
    label: "Belief State",
    description: "Tracks inferences, hunches, and defaults. Explicitly uncertain. Separate from the evidence store. Can be wrong.",
    detail: "The belief state holds what the system thinks is true but cannot prove: inferred user preferences, predicted next actions, default assumptions. It explicitly acknowledges uncertainty. The evidence store holds what is provably true. These two stores are never merged blindly — the Judge mediates between them.",
    keyFact: "Explicitly uncertain, never merged with evidence",
    siteSection: "/world-model",
    position: [-6, 6, -3],
    type: "cognitive",
  },

  // ── Model Seats ──
  {
    id: "model_seat_renderer",
    label: "Renderer (1b/3b)",
    description: "llama3.2:1b preferred, 3b fallback — <100ms realtime responses. Handles 70-85% of turns.",
    detail: "The renderer seat handles the majority of turns: greetings, status, time, simple tool calls, and natural language rendering. Preferred model is llama3.2:1b for speed, with llama3.2:3b as fallback. Deterministic fallback available if all models unavailable.",
    keyFact: "llama3.2:1b/3b, <100ms, 70-85% of turns",
    siteSection: "/model-seats",
    position: [2, -6, -5],
    type: "model-seat",
  },
  {
    id: "model_seat_vision",
    label: "Vision (3b/8b)",
    description: "qwen2.5vl:3b for quick tasks, qwen3-vl:8b for BG1 analysis. Real pixels in, real descriptions out.",
    detail: "Two vision seats: lite (3b) for quick screen capture and OCR under 2s, BG1 (8b) for heavy visual analysis in the background worker. Processes actual pixel data from screen captures, not imagined content.",
    keyFact: "qwen2.5vl:3b + qwen3-vl:8b, <2s + BG1",
    siteSection: "/model-seats",
    position: [5, -8, -5],
    type: "model-seat",
  },
  {
    id: "model_seat_code",
    label: "Code (14b)",
    description: "deepcoder:14b — code generation, debugging, analysis. Runs in BG1 worker lane with bounded loops.",
    detail: "The code specialist handles programming tasks with observe-test-reason-retry loops. Hard caps on iterations, files read, and subprocess time. Outputs are verified by the Judge against actual execution results.",
    keyFact: "deepcoder:14b, BG1 lane, bounded loops",
    siteSection: "/model-seats",
    position: [8, -8, -5],
    type: "model-seat",
  },
  {
    id: "model_seat_embedding",
    label: "Embedding",
    description: "nomic-embed-text-v2-moe — semantic search, RAG retrieval, intent miss analysis. Sub-200ms.",
    detail: "The embedding seat enables semantic search over stored facts. Cosine similarity combined with decayed confidence for ranking. Returns top-5 most relevant facts for RAG enrichment.",
    keyFact: "nomic-embed-text-v2-moe, <200ms",
    siteSection: "/model-seats",
    position: [11, -6, -5],
    type: "model-seat",
  },
  {
    id: "logic_specialist",
    label: "Logic Specialist",
    description: "deepseek-r1:8b — deep reasoning for math, programming logic, and research tasks.",
    detail: "Handles complex reasoning tasks that require extended thought. 300s timeout. Used for math, logic, and deep research.",
    keyFact: "deepseek-r1:8b, 300s timeout",
    siteSection: "/model-seats",
    position: [11, -8, -5],
    type: "model-seat",
  },
  {
    id: "code_reviewer",
    label: "Code Reviewer",
    description: "rnj-1:8b — Sequential relay pass 2. Reviews and profiles code generated by deepcoder.",
    detail: "The second pass of the code generation relay. After deepcoder:14b generates code, rnj-1:8b reviews it for errors, security issues, and performance. If the reviewer fails, the system falls back to the initial generation.",
    keyFact: "rnj-1:8b, Pass 2 of Sequential Relay",
    siteSection: "/model-seats",
    position: [8, -10, -5],
    type: "model-seat",
  },
  {
    id: "bg1_result_retrieval",
    label: "Result Retrieval",
    description: "4-level retrieval cascade for background task results.",
    detail: "Ensures background task results are reliably retrieved and merged back into the main pipeline. Uses a 4-level cascade to handle various completion states and timeouts.",
    keyFact: "4-level retrieval cascade",
    position: [3, 0, 2],
    type: "tool",
  },
  // ── Esoteric Modules (Added) ──
  {
    id: "voice_runtime",
    label: "Voice Runtime (STT)",
    description: "CPU-based faster-whisper STT capturing mic audio locally.",
    detail: "Captures microphone audio locally via PipeWire/PulseAudio. Processes audio directly on the CPU using faster-whisper, generating accurate transcriptions for the ingress hub.",
    keyFact: "Local CPU-only faster-whisper STT",
    position: [-13, 3, 0],
    type: "tool",
  },
  {
    id: "kokoro_tts",
    label: "Kokoro ONNX TTS",
    description: "Bundled ONNX TTS pack for fast local voice synthesis.",
    detail: "Synthesizes voice locally without external APIs. Uses the Kokoro-82M model via ONNX runtime for ultra-fast generation of speech, cascading down to SAPI fallback on failure.",
    keyFact: "Locally bundled ONNX voice pack",
    position: [22, 0, 0],
    type: "output",
  },
  {
    id: "observability_layer",
    label: "Observability Layer",
    description: "JSONL Event Logger, Metrics, Health Monitors.",
    detail: "Outputs structured JSONL event logs containing VoicePathMetrics, trace breakdowns per stage, and tracks semantic intent misses for CRSIS pattern analysis.",
    keyFact: "JSONL Events, Latency breakdown",
    position: [-3, -4, 2],
    type: "brain",
  },
  {
    id: "maintenance_layer",
    label: "Maintenance & Ops",
    description: "Daily Ops, Purge, Model Readiness.",
    detail: "Runs daily smoke tests, prunes stale memory and metrics based on retention policies, and validates model readiness before startup.",
    keyFact: "Automated retention and smoke testing",
    position: [-6, -4, 2],
    type: "guard",
  },
];

export const EDGES: ArchEdge[] = [
  { from: "raw_input", to: "ingress_hub" },
  { from: "ingress_hub", to: "ingress_normalizer" },
  { from: "ingress_normalizer", to: "prompt_dispatcher" },
  { from: "prompt_dispatcher", to: "realtime_lane" },
  { from: "prompt_dispatcher", to: "bg1_queue" },
  { from: "bg1_queue", to: "bg1_worker" },
  { from: "realtime_lane", to: "tool_orchestrator" },
  { from: "bg1_worker", to: "tool_orchestrator" },
  { from: "realtime_lane", to: "response_compiler" },
  { from: "bg1_worker", to: "response_compiler" },
  { from: "tool_orchestrator", to: "response_compiler" },
  { from: "response_compiler", to: "cllm_renderer" },
  { from: "cllm_renderer", to: "speech_formatter" },
  { from: "speech_formatter", to: "output_coordinator" },
  { from: "memory_service", to: "realtime_lane" },
  { from: "memory_service", to: "bg1_worker" },
  { from: "admission_control", to: "bg1_queue" },
  { from: "guardrails", to: "tool_orchestrator" },
  { from: "addon_registry", to: "ingress_hub" },

  // ── Planned → Existing (what each task extends) ──
  { from: "built_g", to: "cllm_renderer" },
  { from: "built_h", to: "memory_service" },
  { from: "built_i", to: "memory_service" },
  { from: "built_j", to: "prompt_dispatcher" },
  { from: "built_k", to: "cllm_renderer" },
  { from: "built_l", to: "ingress_hub" },
  { from: "built_m", to: "bg1_worker" },
  { from: "planned_n", to: "bg1_worker" },
  { from: "planned_o", to: "memory_service" },
  { from: "built_p", to: "memory_service" },
  { from: "planned_q", to: "guardrails" },
  { from: "built_r", to: "output_coordinator" },

  // ── Planned inter-dependencies ──
  { from: "built_g", to: "built_k" },
  { from: "built_i", to: "planned_o" },
  { from: "built_l", to: "planned_q" },
  { from: "built_k", to: "built_r" },

  // ── Newly Built Infrastructure Links ──
  { from: "route_trace_logger", to: "prompt_dispatcher" },
  { from: "bg1_narrator", to: "bg1_worker" },
  { from: "bg1_narrator", to: "output_coordinator" },
  { from: "discord_service", to: "ingress_hub" },

  // ── CRSIS internal ──
  { from: "crsis_analyzer", to: "crsis_engine" },
  { from: "crsis_engine", to: "crsis_proposer" },
  { from: "crsis_proposer", to: "crsis_approval" },
  { from: "crsis_approval", to: "crsis_applier" },
  { from: "built_l", to: "crsis_analyzer" },
  { from: "built_k", to: "crsis_analyzer" },

  // ── Cognitive Layer (Concept D) internal ──
  { from: "deterministic_understanding", to: "prompt_dispatcher" },
  { from: "name_profile", to: "deterministic_understanding" },
  { from: "state_builder", to: "world_state" },
  { from: "world_state", to: "planner" },
  { from: "planner", to: "prompt_dispatcher" },
  { from: "evidence_store", to: "judge" },
  { from: "belief_state", to: "evidence_store" },
  { from: "judge", to: "response_compiler" },
  { from: "pocket_memory", to: "memory_service" },

  // ── Cognitive Layer → Existing ──
  { from: "ingress_hub", to: "state_builder" },
  { from: "ingress_hub", to: "deterministic_understanding" },
  { from: "tool_orchestrator", to: "evidence_store" },
  { from: "memory_service", to: "belief_state" },
  { from: "bg1_worker", to: "evidence_store" },

  // ── Model Seats → Existing ──
  { from: "model_seat_renderer", to: "cllm_renderer" },
  { from: "model_seat_vision", to: "bg1_worker" },
  { from: "model_seat_code", to: "bg1_worker" },
  { from: "model_seat_code", to: "code_reviewer" },
  { from: "logic_specialist", to: "bg1_worker" },
  { from: "model_seat_embedding", to: "memory_service" },
  // ── Esoteric Modules (Added) ──
  { from: "voice_runtime", to: "raw_input" },
  { from: "output_coordinator", to: "kokoro_tts" },
  { from: "prompt_dispatcher", to: "observability_layer" },
  { from: "prompt_dispatcher", to: "bg1_result_retrieval" },
  { from: "maintenance_layer", to: "memory_service" },
];

export const NODE_COLORS: Record<ArchNode["type"], string> = {
  input: "#6b7280",      // gray
  brain: "#3b82f6",      // blue
  lane: "#8b5cf6",       // purple
  tool: "#06b6d4",       // cyan
  renderer: "#f59e0b",   // amber
  output: "#6b7280",     // gray
  memory: "#10b981",     // emerald
  addon: "#f472b6",      // pink
  guard: "#ef4444",      // red
  planned: "#ffffff",    // white — not yet built
  cognitive: "#facc15",  // yellow
  "model-seat": "#fb923c", // orange
  crsis: "#a78bfa",      // violet — built CRSIS components
  partial: "#94a3b8",    // slate — partially built
};

export const NODE_EMISSIVE: Record<ArchNode["type"], string> = {
  input: "#374151",
  brain: "#1d4ed8",
  lane: "#6d28d9",
  tool: "#0891b2",
  renderer: "#d97706",
  output: "#374151",
  memory: "#059669",
  addon: "#db2777",
  guard: "#dc2626",
  planned: "#888888",
  cognitive: "#ca8a04",
  "model-seat": "#ea580c",
  crsis: "#7c3aed",      // dark violet
  partial: "#64748b",    // dark slate
};

export const CRITICAL_PATH = [
  "raw_input",
  "ingress_hub",
  "ingress_normalizer",
  "prompt_dispatcher",
  "realtime_lane",
  "tool_orchestrator",
  "response_compiler",
  "cllm_renderer",
  "speech_formatter",
  "output_coordinator",
];

export interface Region {
  id: string;
  label: string;
  nodeIds: string[];
  color: string;
}

export const REGIONS: Region[] = [
  { id: "ingress", label: "Ingress", nodeIds: ["raw_input", "ingress_hub", "ingress_normalizer", "voice_runtime"], color: "#3b82f6" },
  { id: "routing", label: "Routing & Execution", nodeIds: ["prompt_dispatcher", "realtime_lane", "bg1_queue", "bg1_worker", "tool_orchestrator", "route_trace_logger", "bg1_narrator", "built_n", "bg1_result_retrieval"], color: "#8b5cf6" },
  { id: "rendering", label: "Rendering Pipeline", nodeIds: ["response_compiler", "cllm_renderer", "speech_formatter", "output_coordinator", "built_g", "kokoro_tts"], color: "#f59e0b" },
  { id: "support", label: "Supporting Systems", nodeIds: ["memory_service", "admission_control", "guardrails", "addon_registry", "built_m", "built_h", "built_i", "discord_service", "built_o", "observability_layer", "maintenance_layer"], color: "#10b981" },
  { id: "cognitive", label: "Cognitive Layer (Concept D)", nodeIds: ["deterministic_understanding", "name_profile", "world_state", "state_builder", "planner", "evidence_store", "judge", "belief_state", "pocket_memory"], color: "#facc15" },
  { id: "model-seats", label: "Model Seats", nodeIds: ["model_seat_renderer", "model_seat_vision", "model_seat_code", "model_seat_embedding", "logic_specialist", "code_reviewer"], color: "#fb923c" },
  { id: "crsis", label: "CRSIS (Built)", nodeIds: ["crsis_engine", "crsis_analyzer", "crsis_proposer", "crsis_applier", "crsis_approval", "built_j", "built_k", "built_l", "built_p", "built_r", "built_q"], color: "#a78bfa" },
  { id: "partial", label: "Partially Built", nodeIds: [], color: "#94a3b8" },
  { id: "planned", label: "Not Yet Built", nodeIds: [], color: "#ffffff" },
];
