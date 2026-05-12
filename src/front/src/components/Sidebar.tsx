import { useState } from "react";
import Logo from "../assets/logo.png";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  RefreshCw,
  FileText,
  ChevronRight,
  Settings,
  Download,
  Link2,
  X,
} from "lucide-react";
import { Modal } from './Modal';
import { useApp } from '../hooks/useApp';

type Mode = "all" | "deps" | "circular" | "standalone";

type Props = {
  mode: Mode;
  setMode: (m: Mode) => void;
  circularCount?: number;
  standaloneCount?: number;
  depsCount?: number;
  totalNodes?: number;
  onExport?: () => void;
  onReload?: () => void;
};

type ColorKey = "pink" | "red" | "amber" | "blue";

const modeStyles: Record<
  ColorKey,
  {
    activeBg: string;
    activeBadge: string;
    hoverBg: string;
  }
> = {
  pink: {
    activeBg: "bg-pink-500/10 text-pink-400 border-l-pink-500",
    activeBadge: "bg-pink-500/20 text-pink-300",
    hoverBg: "hover:bg-white/5",
  },
  red: {
    activeBg: "bg-red-500/10 text-red-400 border-l-red-500",
    activeBadge: "bg-red-500/20 text-red-300",
    hoverBg: "hover:bg-white/5",
  },
  amber: {
    activeBg: "bg-amber-500/10 text-amber-400 border-l-amber-500",
    activeBadge: "bg-amber-500/20 text-amber-300",
    hoverBg: "hover:bg-white/5",
  },
  blue: {
    activeBg: "bg-blue-500/10 text-blue-400 border-l-blue-500",
    activeBadge: "bg-blue-500/20 text-blue-300",
    hoverBg: "hover:bg-white/5",
  },
};

export function Sidebar({
  mode,
  setMode,
  circularCount = 0,
  standaloneCount = 0,
  depsCount = 0,
  totalNodes = 0,
  onExport,
  onReload,
}: Props) {
  const { 
    viewMode,
    displayMode,
    setDisplayMode,
    showExportBtn,
    setShowExportBtn,
    showReloadBtn,
    setShowReloadBtn,
    enableTooltips,
    setEnableTooltips
  } = useApp();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  const triggerExportAnimation = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1000);
  };

  const triggerReloadAnimation = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 1000);
  };

  const handleExport = () => {
    triggerExportAnimation();
    onExport?.();
  };

  const handleReload = () => {
    triggerReloadAnimation();
    onReload?.();
  };

  const getModeIcon = (m: Mode) => {
    switch (m) {
      case "all":
        return <LayoutDashboard size={18} />;
      case "deps":
        return <Link2 size={18} />;
      case "circular":
        return <RefreshCw size={18} />;
      case "standalone":
        return <FileText size={18} />;
    }
  };

  const getModeColor = (m: Mode): ColorKey => {
    switch (m) {
      case "all":
        return "pink";
      case "deps":
        return "blue";
      case "circular":
        return "red";
      case "standalone":
        return "amber";
    }
  };

  // Mobile overlay
  const MobileOverlay = () => (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
        isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsMobileOpen(false)}
    />
  );

  // Mobile toggle button
  const MobileToggleButton = () => (
    <button
      onClick={() => setIsMobileOpen(true)}
      className="fixed left-4 top-4 z-50 md:hidden bg-[#1e1e1e] text-[#e4e4e4] p-2 rounded-lg border border-[#2d2d2d] shadow-lg hover:bg-white/5 transition-all"
      aria-label="Open sidebar"
    >
      <PanelLeftOpen size={20} />
    </button>
  );

  // Sidebar content (shared between desktop and mobile)
  const SidebarContent = ({ isMobileView = false }: { isMobileView?: boolean }) => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex px-3 py-3 h-[4rem] items-center justify-between border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-[3.1rem] opacity-90" />
          <span className="text-m font-medium text-[#e4e4e4] tracking-tight">
            <span className="text-blue-400">
              Scaffold
            </span>
            
            <span className="text-amber-400">rite</span>
            </span>
        </div>

        <div className="flex items-center gap-1">
          {!isMobileView && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[#808080] hover:text-[#e4e4e4] transition-colors p-1 rounded hover:bg-white/5 hidden md:block"
              aria-label="Collapse sidebar"
              title="Collapse (Ctrl+B)"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
          {isMobileView && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="text-[#808080] hover:text-[#e4e4e4] transition-colors p-1 rounded hover:bg-white/5"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Mode Selection */}
      <div className="px-2 py-3 flex-1 overflow-y-auto">
        <div className="mb-2 px-2">
          <span className="text-[10px] font-semibold text-[#808080] uppercase tracking-wider">Views</span>
        </div>
        
        {(["all", "deps", "circular", "standalone"] as Mode[]).map((m) => {
          const count =
            m === "all"
              ? totalNodes
              : m === "deps"
              ? depsCount
              : m === "circular"
              ? circularCount
              : standaloneCount;

          const color = getModeColor(m);
          const styles = modeStyles[color];
          const isActive = mode === m;

          return (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                if (isMobileView) setIsMobileOpen(false);
              }}
              onMouseEnter={() => setHoveredItem(m)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                w-full text-left px-3 mt-1 py-2 rounded-md text-sm
                transition-all duration-150 flex items-center justify-between
                border-l-2 border-transparent
                ${isActive ? styles.activeBg : `text-[#b4b4b4] ${styles?.hoverBg}`}
              `}
            >
              <span className="flex items-center gap-2.5">
                <span className={isActive ? "text-current" : "text-[#808080]"}>
                  {getModeIcon(m)}
                </span>
                <span className="capitalize text-[13px]">
                  {m === "deps" ? "Deps only" : m}
                </span>
              </span>

              <div className="flex items-center gap-2">
                {hoveredItem === m && !isActive && (
                  <ChevronRight size={12} className="text-[#808080]" />
                )}
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded min-w-[28px] text-center
                    ${isActive ? styles.activeBadge : "bg-white/5 text-[#b4b4b4]"}
                  `}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions - Settings & Export/Reload */}
      <div className="border-t border-[#2d2d2d] p-2 space-y-1">
        {/* Export Button */}
        {showExportBtn && onExport && viewMode !== 'list' && (
          <button
            onClick={handleExport}
            className={`w-full px-3 py-2 rounded-md text-[13px] transition-all
                     flex items-center gap-2.5 text-[#b4b4b4] hover:bg-white/5 group
                     ${isExporting ? 'bg-green-500/20 text-green-400' : ''}`}
          >
            <Download size={16} className={`transition-transform group-hover:scale-110 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>Export as PNG</span>
            {isExporting && (
              <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-ping" />
            )}
          </button>
        )}

        {/* Reload Button */}
        {showReloadBtn && onReload && (
          <button
            onClick={handleReload}
            className={`w-full px-3 py-2 rounded-md text-[13px] transition-all
                     flex items-center gap-2.5 text-[#b4b4b4] hover:bg-white/5 group`}
          >
            <RefreshCw size={16} className={`transition-all ${isReloading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span>Reload Data</span>
            {isReloading && (
              <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </button>
        )}

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-full px-3 py-2 rounded-md text-[13px] transition-all
                   flex items-center gap-2.5 text-[#b4b4b4] hover:bg-white/5 group"
        >
          <Settings size={16} className="transition-transform group-hover:rotate-90" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );

  // Desktop collapsed view
  const CollapsedView = () => (
    <div className="h-full flex flex-col items-center">
      <div className="border-b h-[4rem] flex items-center justify-center border-[#2d2d2d] relative">
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHoveringLogo(true)}
          onMouseLeave={() => setIsHoveringLogo(false)}
        >
          {!isHoveringLogo ? (
            <img src={Logo} alt="Logo" className="h-[3.1rem] opacity-90" />
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-[#808080] hover:text-[#e4e4e4] transition-all p-1 rounded-md hover:bg-white/5"
              aria-label="Expand sidebar"
              title="Expand (Ctrl+B)"
            >
              <PanelLeftOpen size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        {(["all", "deps", "circular", "standalone"] as Mode[]).map((m) => {
          const isActive = mode === m;
          const color = getModeColor(m);
          const styles = modeStyles[color];

          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`
                p-2 rounded-md transition-all duration-150 relative group
                ${isActive ? styles.activeBg : "text-[#808080] hover:bg-white/5"}
              `}
              title={m === "deps" ? "Dependencies" : m.charAt(0).toUpperCase() + m.slice(1)}
            >
              {getModeIcon(m)}
              
              <span className="absolute left-full ml-2 px-2 py-1 bg-[#2d2d2d] text-[#e4e4e4] text-[11px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#3d3d3d]">
                {m === "deps" ? "Dependencies" : m.charAt(0).toUpperCase() + m.slice(1)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-1 pb-2">
        {/* Export Button in collapsed mode */}
        {showExportBtn && onExport && viewMode !== 'list' && (
          <button
            onClick={handleExport}
            className="p-2 rounded-md text-[#808080] hover:bg-white/5 transition-colors relative group"
            title="Export as PNG"
          >
            <Download size={18} className={isExporting ? 'animate-bounce' : ''} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#2d2d2d] text-[#e4e4e4] text-[11px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#3d3d3d]">
              Export (⌘E)
            </span>
          </button>
        )}

        {/* Reload Button in collapsed mode */}
        {showReloadBtn && onReload && (
          <button
            onClick={handleReload}
            className="p-2 rounded-md text-[#808080] hover:bg-white/5 transition-colors relative group"
            title="Reload Data"
          >
            <RefreshCw size={18} className={isReloading ? 'animate-spin' : ''} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#2d2d2d] text-[#e4e4e4] text-[11px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#3d3d3d]">
              Reload (⌘R)
            </span>
          </button>
        )}

        {/* Settings Button in collapsed mode */}
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-md text-[#808080] hover:bg-white/5 transition-colors relative group"
          title="Settings"
        >
          <Settings size={18} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-[#2d2d2d] text-[#e4e4e4] text-[11px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#3d3d3d]">
            Settings (⌘D)
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden">
      <MobileToggleButton />
      <MobileOverlay />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block relative">
        <div
          className={`
            h-screen bg-[#1e1e1e] text-[#e4e4e4] border-r border-[#2d2d2d]
            transition-all duration-300 ease-in-out overflow-hidden
            ${isExpanded ? "w-80" : "w-12"}
          `}
        >
          <div
            className={`h-full transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-100"
            }`}
          >
            {isExpanded ? <SidebarContent /> : <CollapsedView />}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Slide-out) */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 bg-[#1e1e1e] text-[#e4e4e4] border-r border-[#2d2d2d]
          transition-transform duration-300 ease-in-out z-50 md:hidden
          ${isMobileOpen ? "transform translate-x-0" : "transform -translate-x-full"}
        `}
      >
        <SidebarContent isMobileView={true} />
      </div>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
        <div className="space-y-4">
          {/* Display Type Toggle */}
          <div>
            <label className="text-sm text-[#e4e4e4] block mb-2 font-medium">Display Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDisplayMode("full")}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                  displayMode === "full" 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-[#2d2d2d] text-[#b4b4b4] hover:bg-[#3d3d3d]'
                }`}
              >
                Full Path
              </button>
              <button
                onClick={() => setDisplayMode("filename")}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                  displayMode === "filename" 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-[#2d2d2d] text-[#b4b4b4] hover:bg-[#3d3d3d]'
                }`}
              >
                File Name
              </button>
            </div>
          </div>

          {/* Show Export Button Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-[#e4e4e4] font-medium">Show Export Button</label>
            <button
              onClick={() => setShowExportBtn(!showExportBtn)}
              className={`w-10 h-5 rounded-full transition-all ${showExportBtn ? 'bg-pink-500' : 'bg-[#3d3d3d]'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform m-0.5 ${showExportBtn ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Show Reload Button Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-[#e4e4e4] font-medium">Show Reload Button</label>
            <button
              onClick={() => setShowReloadBtn(!showReloadBtn)}
              className={`w-10 h-5 rounded-full transition-all ${showReloadBtn ? 'bg-pink-500' : 'bg-[#3d3d3d]'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform m-0.5 ${showReloadBtn ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Enable Tooltips Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-[#e4e4e4] font-medium">Enable Tooltips</label>
            <button
              onClick={() => setEnableTooltips(!enableTooltips)}
              className={`w-10 h-5 rounded-full transition-all ${enableTooltips ? 'bg-pink-500' : 'bg-[#3d3d3d]'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform m-0.5 ${enableTooltips ? 'translate-x-5' : ''}`} />
            </button>
          </div>

         
        </div>
      </Modal>
    </div>
  );
}