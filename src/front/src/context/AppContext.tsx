import {
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

type ViewMode = "graph" | "list";
type DisplayMode = "full" | "filename";
type DependencyMode = "all" | "circular" | "standalone" | "deps";

interface AppContextType {
  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Display Mode
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;

  // Dependency Mode
  dependencyMode: DependencyMode;
  setDependencyMode: (mode: DependencyMode) => void;

  // UI Settings
  showExportBtn: boolean;
  setShowExportBtn: (show: boolean) => void;

  showReloadBtn: boolean;
  setShowReloadBtn: (show: boolean) => void;

  enableTooltips: boolean;
  setEnableTooltips: (enable: boolean) => void;
}

export const AppContext = createContext<
  AppContextType | undefined
>(undefined);

const STORAGE_PREFIX = "scaffoldrite-cli";

const storageKey = (key: string) =>
  `${STORAGE_PREFIX}:${key}`;

const loadFromLocalStorage = (
  key: string,
  defaultValue: any
) => {
  const stored = localStorage.getItem(key);

  if (stored !== null) {
    return JSON.parse(stored);
  }

  return defaultValue;
};

const saveToLocalStorage = (
  key: string,
  value: any
) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [viewMode, setViewMode] =
    useState<ViewMode>(() =>
      loadFromLocalStorage(
        storageKey("viewMode"),
        "graph"
      )
    );

  const [displayMode, setDisplayMode] =
    useState<DisplayMode>(() =>
      loadFromLocalStorage(
        storageKey("displayMode"),
        "full"
      )
    );

  const [dependencyMode, setDependencyMode] =
    useState<DependencyMode>(() =>
      loadFromLocalStorage(
        storageKey("dependencyMode"),
        "all"
      )
    );

  const [showExportBtn, setShowExportBtn] =
    useState<boolean>(() =>
      loadFromLocalStorage(
        storageKey("showExportBtn"),
        true
      )
    );

  const [showReloadBtn, setShowReloadBtn] =
    useState<boolean>(() =>
      loadFromLocalStorage(
        storageKey("showReloadBtn"),
        true
      )
    );

  const [enableTooltips, setEnableTooltips] =
    useState<boolean>(() =>
      loadFromLocalStorage(
        storageKey("enableTooltips"),
        true
      )
    );

  useEffect(() => {
    saveToLocalStorage(
      storageKey("viewMode"),
      viewMode
    );
  }, [viewMode]);

  useEffect(() => {
    saveToLocalStorage(
      storageKey("displayMode"),
      displayMode
    );
  }, [displayMode]);

  useEffect(() => {
    saveToLocalStorage(
      storageKey("dependencyMode"),
      dependencyMode
    );
  }, [dependencyMode]);

  useEffect(() => {
    saveToLocalStorage(
      storageKey("showExportBtn"),
      showExportBtn
    );
  }, [showExportBtn]);

  useEffect(() => {
    saveToLocalStorage(
      storageKey("showReloadBtn"),
      showReloadBtn
    );
  }, [showReloadBtn]);

  useEffect(() => {
    saveToLocalStorage(
      storageKey("enableTooltips"),
      enableTooltips
    );
  }, [enableTooltips]);

  const value = {
    viewMode,
    setViewMode,

    displayMode,
    setDisplayMode,

    dependencyMode,
    setDependencyMode,

    showExportBtn,
    setShowExportBtn,

    showReloadBtn,
    setShowReloadBtn,

    enableTooltips,
    setEnableTooltips,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}