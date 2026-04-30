import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { useVaultStore } from "@/store/vaultStore";
import BreadCrumb from "./components/BreadCrumb.components";
import WikiPopover from "./components/WikiPopover.components";
import SlashMenu from "./components/SlashMenu.components";
import FloatingToolbar from "./components/FloatingToolbar.components";
import CodeMirrorEditor from "./CodeMirrorEditor";

const SERIF = "var(--m-serif)";

interface Props {
  noteId: string;
}

export default function Editor({ noteId }: Props) {
  const { vaultPath } = useVaultStore();
  const [slashOpen, setSlash] = useState(false);
  const [wikiOpen, setWiki] = useState(false);

  const fullPath = vaultPath ? `${vaultPath}/${noteId}` : null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", fullPath],
    queryFn: () => invoke<string>("read_note", { path: fullPath! }),
    enabled: !!fullPath,
  });

  const title = noteId.split("/").pop()?.replace(/\.md$/, "") ?? noteId;
  const pathDisplay = noteId.replace(/\//g, " / ");

  if (isLoading) {
    return (
      <div style={{ flex: 1, padding: "52px 56px" }}>
        {[180, 320, 240, 280, 200, 360, 160].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? 42 : 16,
              marginBottom: i === 0 ? 24 : 10,
              borderRadius: 3,
              background: "var(--m-bg-2)",
              width: w,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  if (isError || data === undefined) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "var(--m-text-3)",
            fontFamily: "var(--m-mono)",
          }}
        >
          Could not load note.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
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
          <BreadCrumb path={pathDisplay} className="mono-label" />

          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: 38,
              lineHeight: 1.12,
              letterSpacing: -0.5,
              color: "var(--m-text)",
              margin: "0 0 32px",
            }}
          >
            {title}
          </h1>

          <CodeMirrorEditor
            key={noteId}
            value={data}
            onWikilinkClick={(_target) => {
              // TODO: navigate to note by target name
            }}
          />
        </div>
      </div>

      <FloatingToolbar
        slashOpen={slashOpen}
        wikiOpen={wikiOpen}
        onSlashToggle={() => setSlash((s) => !s)}
        onWikiToggle={() => setWiki((w) => !w)}
      />

      {slashOpen && <SlashMenu />}

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
