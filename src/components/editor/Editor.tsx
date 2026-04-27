import { useState } from "react";
import { Link2, Sparkles } from "lucide-react";
import { MTag, Dot, Kbd } from "@/components/ui/atoms";

interface PBlock {
  kind: "p";
  text: string;
}
interface H2Block {
  kind: "h2";
  text: string;
}
interface UlBlock {
  kind: "ul";
  items: string[];
}
interface WPBlock {
  kind: "wikilink-p";
  text: string;
  link: string;
  after: string;
}
type BodyBlock = PBlock | H2Block | UlBlock | WPBlock;

interface GutterSuggestion {
  kind: string;
  text: string;
  strength: number;
}

const SERIF = "var(--m-serif)";

const NOTE_PATH = "ideas / on-compression-of-thought.md";
const NOTE_TITLE = "On compression of thought";
const NOTE_TAGS = ["idea", "pkm", "design"];

const NOTE_BODY: BodyBlock[] = [
  {
    kind: "p",
    text: "A note is a compression artifact. The act of writing forces you to discard ninety percent of what was in your head; what remains is denser, more transferable, and — crucially — addressable.",
  },
  {
    kind: "p",
    text: "Most personal knowledge tools are storage. They optimize for the moment of capture. The harder problem is retrieval that respects the original act of compression: surfacing notes when they are useful, not when they match a keyword.",
  },
  { kind: "h2", text: "The retrieval failure" },
  {
    kind: "p",
    text: "I have searched my own vault three times this week and found nothing. Each time, the note I wanted existed, but I had archived it under a category I no longer think in. The vocabulary of past-me is foreign to present-me.",
  },
  {
    kind: "p",
    text: 'A model trained on the vault could bridge this gap. Not by generating prose, but by translating between past and present taxonomies. When I write "feedback loops," surface the 2024 entry titled "closed-loop systems" — same idea, different words.',
  },
  { kind: "h2", text: "What the AI should not do" },
  {
    kind: "p",
    text: "It should not write for me. It should not summarize aggressively. It should not pretend to understand. The compression that matters is mine; the model is a librarian, not a co-author.",
  },
  {
    kind: "wikilink-p",
    text: "See also: ",
    link: "Bret Victor — thinking tools",
    after:
      " for a related argument about tools that amplify rather than replace.",
  },
  { kind: "h2", text: "Open questions" },
  {
    kind: "ul",
    items: [
      "How do you evaluate a librarian? Precision and recall, but on what corpus?",
      "Should the model ever surface notes unprompted, or only on query?",
      'What is the latency budget for "feels invisible"?',
    ],
  },
];

const GUTTER_SUGGESTIONS: GutterSuggestion[] = [
  { kind: "connect", text: "Related: Zettelkasten origins", strength: 0.82 },
  {
    kind: "expand",
    text: "Expand: vocabulary drift over time",
    strength: 0.71,
  },
  {
    kind: "connect",
    text: "Related: Bret Victor — thinking tools",
    strength: 0.91,
  },
];

const WIKI_MATCHES = [
  { name: "Bret Victor — thinking tools", folder: "Reading" },
  { name: "Brett — quick contact note", folder: "Daily" },
  { name: "Brain dump — April", folder: "Daily" },
];

const SLASH_ITEMS = [
  { cmd: "/summarize", desc: "Summarize selection" },
  { cmd: "/expand", desc: "Expand idea into a paragraph" },
  { cmd: "/connect", desc: "Suggest related notes" },
  { cmd: "/draft", desc: "Generate draft from outline" },
  { cmd: "/cite", desc: "Find citations in vault" },
];

function floatBtn(active: boolean): React.CSSProperties {
  return {
    padding: "5px 11px",
    fontSize: 11.5,
    background: active ? "var(--m-bg-4)" : "transparent",
    border: "none",
    borderRadius: 5,
    color: active ? "var(--m-text)" : "var(--m-text-2)",
    cursor: "pointer",
    fontFamily: "var(--m-sans)",
  };
}

function WikiPopover() {
  return (
    <div
      className="m-slide-in"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        marginTop: 6,
        width: 320,
        background: "var(--m-bg-3)",
        border: "1px solid var(--m-line)",
        borderRadius: 6,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          fontSize: 10.5,
          fontFamily: "var(--m-mono)",
          color: "var(--m-text-4)",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          borderBottom: "1px solid var(--m-line-soft)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Link to note · matches "brett"</span>
        <span style={{ marginLeft: "auto" }}>
          <Kbd>↑↓</Kbd> <Kbd>↵</Kbd>
        </span>
      </div>
      {WIKI_MATCHES.map((m, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            fontSize: 12,
            background: i === 0 ? "var(--m-bg-4)" : "transparent",
            color: "var(--m-text-2)",
            cursor: "pointer",
            borderBottom:
              i < WIKI_MATCHES.length - 1
                ? "1px solid var(--m-line-soft)"
                : "none",
          }}
        >
          <span style={{ color: "var(--m-text-4)" }}>
            <svg
              width={11}
              height={11}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
              <path d="M14 3v6h6" />
            </svg>
          </span>
          <span style={{ flex: 1, fontFamily: SERIF, fontSize: 13 }}>
            {m.name}
          </span>
          <span
            style={{
              fontFamily: "var(--m-mono)",
              fontSize: 10,
              color: "var(--m-text-4)",
            }}
          >
            {m.folder}
          </span>
        </div>
      ))}
      <div
        style={{
          padding: "8px 12px",
          fontSize: 11.5,
          color: "var(--m-ai)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderTop: "1px solid var(--m-line-soft)",
          cursor: "pointer",
        }}
      >
        <Dot color="var(--m-ai)" size={5} pulse />
        <span
          style={{
            fontFamily: "var(--m-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          AI
        </span>
        <span>Create new "Brett — thinking tools" linked to 4 notes</span>
      </div>
    </div>
  );
}

function SlashMenu() {
  return (
    <div
      className="m-slide-in"
      style={{
        position: "absolute",
        bottom: 80,
        left: 56,
        width: 320,
        background: "var(--m-bg-3)",
        border: "1px solid var(--m-line)",
        borderRadius: 7,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          fontSize: 10.5,
          fontFamily: "var(--m-mono)",
          color: "var(--m-text-4)",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          borderBottom: "1px solid var(--m-line-soft)",
        }}
      >
        AI commands
      </div>
      {SLASH_ITEMS.map((it, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            fontSize: 12,
            background: i === 0 ? "var(--m-bg-4)" : "transparent",
            color: "var(--m-text-2)",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "var(--m-mono)",
              color: "var(--m-accent)",
              fontSize: 11.5,
            }}
          >
            {it.cmd}
          </span>
          <span style={{ flex: 1, color: "var(--m-text-3)" }}>{it.desc}</span>
          {i === 0 && <Kbd>↵</Kbd>}
        </div>
      ))}
    </div>
  );
}

export default function Editor() {
  const [slashOpen, setSlash] = useState(false);
  const [wikiOpen, setWiki] = useState(false);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Scrollable note content */}
      <div
        className="m-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "52px 0 100px",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 56px" }}>
          {/* Breadcrumb */}
          <div
            style={{
              fontFamily: "var(--m-mono)",
              fontSize: 10.5,
              color: "var(--m-text-4)",
              marginBottom: 18,
              letterSpacing: 0.4,
            }}
          >
            {NOTE_PATH}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: 38,
              lineHeight: 1.12,
              letterSpacing: -0.5,
              color: "var(--m-text)",
              margin: "0 0 8px",
            }}
          >
            {NOTE_TITLE}
          </h1>

          {/* Tags */}
          <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
            {NOTE_TAGS.map((t) => (
              <MTag key={t} name={t} accent={t === "idea"} />
            ))}
          </div>

          {/* Body */}
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 17,
              lineHeight: 1.7,
              color: "var(--m-text)",
            }}
          >
            {NOTE_BODY.map((b, i) => {
              if (b.kind === "p") {
                return (
                  <p key={i} style={{ margin: "0 0 1.1em" }}>
                    {b.text}
                  </p>
                );
              }
              if (b.kind === "h2") {
                return (
                  <h2
                    key={i}
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 500,
                      fontSize: 22,
                      marginTop: "1.7em",
                      marginBottom: "0.45em",
                      color: "var(--m-text)",
                      letterSpacing: -0.25,
                    }}
                  >
                    {b.text}
                  </h2>
                );
              }
              if (b.kind === "ul") {
                return (
                  <ul key={i} style={{ margin: "0 0 1.1em", paddingLeft: 22 }}>
                    {b.items.map((it, j) => (
                      <li key={j} style={{ margin: "0 0 0.35em" }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (b.kind === "wikilink-p") {
                return (
                  <p key={i} style={{ margin: "0 0 1.1em" }}>
                    {b.text}
                    <span
                      style={{
                        color: "var(--m-accent)",
                        borderBottom:
                          "1px dashed color-mix(in oklch, var(--m-accent) 50%, transparent)",
                        padding: "0 1px",
                        cursor: "pointer",
                      }}
                    >
                      [[{b.link}]]
                    </span>
                    {b.after}
                  </p>
                );
              }
              return null;
            })}

            {/* Live wikilink composition */}
            <p
              style={{
                margin: "0 0 1.1em",
                color: "var(--m-text-2)",
                position: "relative",
              }}
            >
              The librarian metaphor needs more work — see also{" "}
              <span
                style={{
                  position: "relative",
                  color: "var(--m-accent)",
                  fontFamily: "var(--m-mono)",
                  fontSize: "0.92em",
                }}
              >
                {"[["}
                <span
                  onClick={() => setWiki(true)}
                  style={{
                    cursor: "pointer",
                    borderBottom:
                      "1px dashed color-mix(in oklch, var(--m-accent) 50%, transparent)",
                  }}
                >
                  brett
                </span>
                <span
                  className="m-cursor"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: "1em",
                    verticalAlign: "-2px",
                    background: "var(--m-accent)",
                    marginLeft: 1,
                  }}
                />
                {wikiOpen && <WikiPopover />}
              </span>
            </p>
          </div>
        </div>

        {/* Right gutter — AI hints */}
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 12,
            width: 200,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {GUTTER_SUGGESTIONS.map((s, i) => (
            <div
              key={i}
              className="m-slide-in"
              style={{
                padding: "8px 10px",
                borderLeft: "2px solid var(--m-ai)",
                background: "color-mix(in oklch, var(--m-ai) 6%, transparent)",
                fontSize: 11,
                color: "var(--m-text-2)",
                lineHeight: 1.4,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 4,
                }}
              >
                <Dot color="var(--m-ai)" size={5} />
                <span
                  style={{
                    fontFamily: "var(--m-mono)",
                    fontSize: 9.5,
                    color: "var(--m-ai)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {s.kind}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--m-mono)",
                    fontSize: 9.5,
                    color: "var(--m-text-4)",
                  }}
                >
                  {Math.round(s.strength * 100)}
                </span>
              </div>
              {s.text}
            </div>
          ))}
        </div>

        {slashOpen && <SlashMenu />}
      </div>

      {/* Floating bottom toolbar */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 4,
          padding: 4,
          background: "var(--m-bg-3)",
          border: "1px solid var(--m-line-soft)",
          borderRadius: 8,
          boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
        }}
      >
        <button onClick={() => setSlash((s) => !s)} style={floatBtn(slashOpen)}>
          <span style={{ fontFamily: "var(--m-mono)" }}>/</span> commands
        </button>
        <button style={floatBtn(false)}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            <Sparkles size={11} /> ask
          </span>
        </button>
        <button onClick={() => setWiki((w) => !w)} style={floatBtn(wikiOpen)}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            <Link2 size={11} /> link
          </span>
        </button>
      </div>
    </div>
  );
}
