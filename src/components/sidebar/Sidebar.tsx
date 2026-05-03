import { Footer, FileTree, SearchBar, NavTabs, Tags } from "./components";

export default function AppSidebar() {
  return (
    <aside
      style={{
        marginTop: 36,
        width: 240,
        height: "calc(100vh - 36px)",
        background: "var(--m-bg)",
        borderRight: "1px solid var(--m-line-soft)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <NavTabs />
      <SearchBar />
      <FileTree />
      <Tags />
      <Footer />
    </aside>
  );
}
