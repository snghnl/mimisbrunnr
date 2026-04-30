import { useState } from "react";
import { MTag, Dot } from "@/components/ui/atoms";
import BreadCrumb from "./components/BreadCrumb.components";
import WikiPopover from "./components/WikiPopover.components";
import SlashMenu from "./components/SlashMenu.components";
import FloatingToolbar from "./components/FloatingToolbar.components";
import CodeMirrorEditor from "./CodeMirrorEditor";

interface GutterSuggestion {
  kind: string;
  text: string;
  strength: number;
}

const SERIF = "var(--m-serif)";

const NOTE_PATH =
  "ideas / test1 /test2/ test3/ test4/ on-compression-of-thought.md";
const NOTE_TITLE = "On compression of thought";
const NOTE_TAGS = ["idea", "pkm", "design"];

const NOTE_CONTENT = `A note is a compression artifact. The act of writing forces you to discard ninety percent of what was in your head; what remains is denser, more transferable, and — crucially — addressable.

Most personal knowledge tools are storage. They optimize for the moment of capture. The harder problem is retrieval that respects the original act of compression: surfacing notes when they are useful, not when they match a keyword.

## The retrieval failure

I have searched my own vault three times this week and found nothing. Each time, the note I wanted existed, but I had archived it under a category I no longer think in. The vocabulary of past-me is foreign to present-me.

A model trained on the vault could bridge this gap. Not by generating prose, but by translating between past and present taxonomies. When I write "feedback loops," surface the 2024 entry titled "closed-loop systems" — same idea, different words.

## What the AI should not do

It should not write for me. It should not summarize aggressively. It should not pretend to understand. The compression that matters is mine; the model is a librarian, not a co-author.

See also: [[Bret Victor — thinking tools]] for a related argument about tools that amplify rather than replace.

## Open questions

- How do you evaluate a librarian? Precision and recall, but on what corpus?
- Should the model ever surface notes unprompted, or only on query?
- What is the latency budget for "feels invisible"?

The librarian metaphor needs more work — see also [[brett]]`;

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

export default function Editor() {
  const [slashOpen, setSlash] = useState(false);
  const [wikiOpen, setWiki] = useState(false);
  const [content, setContent] = useState(NOTE_CONTENT);

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
          <BreadCrumb path={NOTE_PATH} className="mono-label" />

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

          {/* Body — CodeMirror editor */}
          <CodeMirrorEditor
            value={content}
            onChange={setContent}
            onWikilinkClick={(target) => {
              // TODO: navigate to note by target name
              console.info("wikilink clicked:", target);
            }}
          />
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

      <FloatingToolbar
        slashOpen={slashOpen}
        wikiOpen={wikiOpen}
        onSlashToggle={() => setSlash((s) => !s)}
        onWikiToggle={() => setWiki((w) => !w)}
      />

      {/* WikiPopover — shown when link button is active */}
      {wikiOpen && (
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <WikiPopover />
        </div>
      )}
    </div>
  );
}
