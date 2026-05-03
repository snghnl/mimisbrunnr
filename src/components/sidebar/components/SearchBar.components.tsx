import { Search } from "lucide-react";
import { Kbd } from "@/components/ui/atoms";
import { useUIStore } from "@/store/uiStore";

export default function SearchBar() {
  const { setCommandPaletteOpen } = useUIStore();
  return (
    <div style={{ padding: "0 12px 8px" }}>
      <div
        onClick={() => setCommandPaletteOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "6px 9px",
          background: "var(--m-bg-2)",
          border: "1px solid var(--m-line-soft)",
          borderRadius: 5,
          color: "var(--m-text-3)",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        <Search size={12} />
        <span style={{ flex: 1 }}>Search vault</span>
        <Kbd>⌘K</Kbd>
      </div>
    </div>
  );
}
