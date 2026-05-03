import { Settings } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { Mark } from "@/components/ui/atoms";
import { useVaultStore } from "@/store/vaultStore";

export default function Footer() {
  const { vaultPath, setVaultPath } = useVaultStore();
  const vaultName = vaultPath?.split("/").pop() ?? "no vault";

  const { data: paths = [] } = useQuery({
    queryKey: ["vault", vaultPath],
    queryFn: () => invoke<string[]>("scan_vault", { vaultPath }),
    enabled: !!vaultPath,
  });
  return (
    <div
      style={{
        marginTop: "auto",
        padding: "10px 12px",
        borderTop: "1px solid var(--m-line-soft)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--m-bg-3)",
          borderRadius: "50%",
        }}
      >
        <Mark size={14} color="var(--m-text)" />
      </span>
      <div style={{ flex: 1, fontSize: 11.5, lineHeight: 1.2 }}>
        <div style={{ color: "var(--m-text-2)" }}>{vaultName}</div>
        <div
          style={{
            color: "var(--m-text-4)",
            fontFamily: "var(--m-mono)",
            fontSize: 10,
          }}
        >
          {paths.length} files
        </div>
      </div>
      <span
        onClick={async () => {
          const selected = await open({ directory: true, multiple: false });
          if (typeof selected === "string") setVaultPath(selected);
        }}
        style={{ color: "var(--m-text-3)", cursor: "pointer" }}
      >
        <Settings size={13} />
      </span>
    </div>
  );
}
