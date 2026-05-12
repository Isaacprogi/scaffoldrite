import { 
  Network, 
  List, 
} from 'lucide-react';
import { useApp } from '../hooks/useApp';

export function Header() {
  const { viewMode, setViewMode } = useApp();

  return (
    <header className="bg-[#1e1e1e] border-b border-[#2d2d2d] px-6 h-[4rem] relative backdrop-blur-sm">
      <div className="flex items-center justify-between h-full">
        {/* Left side - empty now */}
        <div className='flex items-center gap-2'>
          {/* All controls moved to sidebar */}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          

          {/* View Toggle */}
          <div className="flex gap-1 bg-[#2d2d2d] rounded-md p-0.5">
            <button
              onClick={() => setViewMode("graph")}
              className={`
                px-3 py-1.5 rounded text-[13px] font-medium transition-all duration-200
                flex items-center gap-2 relative overflow-hidden
                ${viewMode === "graph" 
                  ? 'bg-pink-500 text-white shadow-sm' 
                  : 'text-[#b4b4b4] hover:text-[#e4e4e4] hover:bg-white/5'
                }
              `}
            >
              <Network size={14} />
              <span className="hidden md:inline">Graph</span>
              {viewMode === "graph" && (
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-white/20 to-pink-500/0 animate-shimmer" />
              )}
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`
                px-3 py-1.5 rounded text-[13px] font-medium transition-all duration-200
                flex items-center gap-2 relative overflow-hidden
                ${viewMode === "list" 
                  ? 'bg-pink-500 text-white shadow-sm' 
                  : 'text-[#b4b4b4] hover:text-[#e4e4e4] hover:bg-white/5'
                }
              `}
            >
              <List size={14} />
              <span className="hidden md:inline">List</span>
              {viewMode === "list" && (
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-white/20 to-pink-500/0 animate-shimmer" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}