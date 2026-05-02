import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/dom";
import { useGlobalHotkeys } from "./useGlobalHotkeys";
import { useUIStore } from "@/store/uiStore";

// Reset store state before each test
beforeEach(() => {
  useUIStore.setState({
    commandPaletteOpen: false,
    tabs: [],
    activeTabId: null,
  });
});

describe("useGlobalHotkeys — command palette", () => {
  it("Cmd+K opens command palette", async () => {
    renderHook(() => useGlobalHotkeys());
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(useUIStore.getState().commandPaletteOpen).toBe(true);
  });

  it("Escape closes command palette", async () => {
    useUIStore.setState({ commandPaletteOpen: true });
    renderHook(() => useGlobalHotkeys());
    await userEvent.keyboard("{Escape}");
    expect(useUIStore.getState().commandPaletteOpen).toBe(false);
  });
});

describe("useGlobalHotkeys — tab shortcuts", () => {
  it("Cmd+D opens dashboard tab", async () => {
    const openTab = vi.spyOn(useUIStore.getState(), "openTab");
    renderHook(() => useGlobalHotkeys());
    await userEvent.keyboard("{Meta>}d{/Meta}");
    expect(openTab).toHaveBeenCalledWith({ type: "dashboard" });
  });

  it("Cmd+G opens graph tab", async () => {
    const openTab = vi.spyOn(useUIStore.getState(), "openTab");
    renderHook(() => useGlobalHotkeys());
    await userEvent.keyboard("{Meta>}g{/Meta}");
    expect(openTab).toHaveBeenCalledWith({ type: "graph" });
  });

  it("Cmd+W closes active tab", async () => {
    useUIStore.setState({
      tabs: [{ type: "dashboard", id: "tab-1" }],
      activeTabId: "tab-1",
    });
    renderHook(() => useGlobalHotkeys());
    await userEvent.keyboard("{Meta>}w{/Meta}");
    expect(useUIStore.getState().tabs).toHaveLength(0);
    expect(useUIStore.getState().activeTabId).toBeNull();
  });

  it("Cmd+W is a no-op when no tabs are open", async () => {
    renderHook(() => useGlobalHotkeys());
    await userEvent.keyboard("{Meta>}w{/Meta}");
    expect(useUIStore.getState().tabs).toHaveLength(0);
  });

  it("Cmd+Shift+] advances to next tab", () => {
    useUIStore.setState({
      tabs: [
        { type: "dashboard", id: "tab-1" },
        { type: "graph", id: "tab-2" },
      ],
      activeTabId: "tab-1",
    });
    renderHook(() => useGlobalHotkeys());
    fireEvent.keyDown(document, {
      key: "]",
      code: "BracketRight",
      metaKey: true,
      shiftKey: true,
    });
    expect(useUIStore.getState().activeTabId).toBe("tab-2");
  });

  it("Cmd+Shift+[ retreats to previous tab", () => {
    useUIStore.setState({
      tabs: [
        { type: "dashboard", id: "tab-1" },
        { type: "graph", id: "tab-2" },
      ],
      activeTabId: "tab-2",
    });
    renderHook(() => useGlobalHotkeys());
    fireEvent.keyDown(document, {
      key: "[",
      code: "BracketLeft",
      metaKey: true,
      shiftKey: true,
    });
    expect(useUIStore.getState().activeTabId).toBe("tab-1");
  });

  it("Cmd+Shift+] wraps around from last to first tab", () => {
    useUIStore.setState({
      tabs: [
        { type: "dashboard", id: "tab-1" },
        { type: "graph", id: "tab-2" },
      ],
      activeTabId: "tab-2",
    });
    renderHook(() => useGlobalHotkeys());
    fireEvent.keyDown(document, {
      key: "]",
      code: "BracketRight",
      metaKey: true,
      shiftKey: true,
    });
    expect(useUIStore.getState().activeTabId).toBe("tab-1");
  });

  it("Cmd+Shift+[ wraps around from first to last tab", () => {
    useUIStore.setState({
      tabs: [
        { type: "dashboard", id: "tab-1" },
        { type: "graph", id: "tab-2" },
      ],
      activeTabId: "tab-1",
    });
    renderHook(() => useGlobalHotkeys());
    fireEvent.keyDown(document, {
      key: "[",
      code: "BracketLeft",
      metaKey: true,
      shiftKey: true,
    });
    expect(useUIStore.getState().activeTabId).toBe("tab-2");
  });
});
