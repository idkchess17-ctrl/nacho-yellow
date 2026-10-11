/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="flex h-screen w-full bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-[#1a1a1a] bg-[#0a0a0a] flex flex-col hidden md:flex">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF8A00] to-[#FFD600] rounded-lg shadow-[0_0_15px_rgba(255,138,0,0.4)] flex items-center justify-center text-black font-black italic">
              N
            </div>
            <h1 className="text-2xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              NACHO
            </h1>
          </div>
          <nav className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">
                Core Systems
              </p>
              <div className="flex items-center space-x-3 text-[#FF8A00] bg-[#1a130a] p-3 rounded-lg border border-[#3d2a0e]">
                <span className="text-lg">◈</span>
                <span className="text-sm font-semibold">Overview</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-3 rounded-lg transition-colors cursor-pointer">
                <span className="text-lg">⧉</span>
                <span className="text-sm font-medium">File Explorer</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-3 rounded-lg transition-colors cursor-pointer">
                <span className="text-lg">⚙</span>
                <span className="text-sm font-medium">Node Config</span>
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">
                Monitoring
              </p>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-3 rounded-lg transition-colors cursor-pointer">
                <span className="text-lg">⚞</span>
                <span className="text-sm font-medium">Network Traffic</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white p-3 rounded-lg transition-colors cursor-pointer">
                <span className="text-lg">≋</span>
                <span className="text-sm font-medium">Live Logs</span>
              </div>
            </div>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-[#1a1a1a]">
          <div className="bg-[#121212] p-4 rounded-xl border border-[#1a1a1a]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-500">
                Server Health
              </span>
              <span className="text-[10px] text-[#00FF66] font-bold">
                CRUNCHY
              </span>
            </div>
            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#00FF66] w-[88%] shadow-[0_0_8px_#00FF66]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-[#1a1a1a] flex items-center justify-between px-6 md:px-10 bg-[#070707]/50 backdrop-blur-xl">
          <div>
            <h2 className="text-sm font-medium text-gray-400 truncate">
              Workspace / <span className="text-white">Global-Production-Cluster</span>
            </h2>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden sm:flex items-center space-x-2 bg-[#121212] px-4 py-2 rounded-full border border-[#1a1a1a]">
              <div className="w-2 h-2 bg-[#FF8A00] rounded-full animate-pulse shadow-[0_0_8px_#FF8A00]"></div>
              <span className="text-xs font-mono text-gray-300">
                UPTIME: 412:08:12
              </span>
            </div>
            <button className="w-10 h-10 rounded-full border border-[#1a1a1a] flex items-center justify-center text-gray-400 hover:bg-[#121212] transition-colors cursor-pointer">
              🔔
            </button>
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333]"></div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 grid-rows-none lg:grid-rows-2 gap-6 flex-1 overflow-y-auto">
          {/* Stat Card 1 */}
          <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl italic font-black">CPU</span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              Processing Load
            </p>
            <h3 className="text-4xl font-light text-white mb-4">
              42.8<span className="text-xl text-[#FF8A00]">%</span>
            </h3>
            <div className="flex items-end space-x-1 h-12">
              <div className="w-full bg-[#1a1a1a] h-[30%] rounded-t-sm hover:bg-[#FF8A00] transition-all"></div>
              <div className="w-full bg-[#1a1a1a] h-[45%] rounded-t-sm hover:bg-[#FF8A00] transition-all"></div>
              <div className="w-full bg-[#1a1a1a] h-[60%] rounded-t-sm hover:bg-[#FF8A00] transition-all"></div>
              <div className="w-full bg-[#FF8A00] h-[40%] rounded-t-sm shadow-[0_0_10px_rgba(255,138,0,0.3)]"></div>
              <div className="w-full bg-[#1a1a1a] h-[25%] rounded-t-sm hover:bg-[#FF8A00] transition-all"></div>
              <div className="w-full bg-[#1a1a1a] h-[55%] rounded-t-sm hover:bg-[#FF8A00] transition-all"></div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl italic font-black">MEM</span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              Buffer Usage
            </p>
            <h3 className="text-4xl font-light text-white mb-4">
              12.1<span className="text-xl text-[#FFD600]">GB</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>VIRTUAL_PAGING</span>
                <span>STABLE</span>
              </div>
              <div className="h-2 w-full bg-[#1a1a1a] rounded-full">
                <div className="h-full bg-gradient-to-r from-[#FF8A00] to-[#FFD600] w-[75%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl italic font-black">NET</span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              Throughput
            </p>
            <h3 className="text-4xl font-light text-white mb-2">
              892<span className="text-xl text-[#FF8A00]">mbps</span>
            </h3>
            <div className="text-xs text-gray-400 font-mono">
              ↑ 124.5 | ↓ 767.5
            </div>
            <div className="mt-4 p-2 bg-[#121212] rounded-lg border border-[#1a1a1a] text-[10px] font-mono text-gray-500">
              EXTERNAL_IP: 142.250.190.46
            </div>
          </div>

          {/* Detailed Logs / File View */}
          <div className="lg:col-span-3 bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
              <div className="flex items-center space-x-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                  Recent System Logs
                </h4>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#1a1a1a] text-[#FF8A00] text-[10px] font-mono border border-[#3d2a0e]">
                  FILTERS: ERROR, WARN
                </span>
              </div>
              <button className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest cursor-pointer">
                Export.csv
              </button>
            </div>
            <div className="flex-1 p-6 font-mono text-[11px] leading-relaxed overflow-y-auto">
              <div className="flex space-x-4 mb-2 text-gray-500">
                <span className="text-[#FF8A00] shrink-0">[08:42:11]</span>
                <span className="text-white shrink-0">INFO:</span>
                <span>Kernel version 5.15.0-nacho-spicy-rev4 initialized successfully.</span>
              </div>
              <div className="flex space-x-4 mb-2 text-gray-500">
                <span className="text-[#FF8A00] shrink-0">[08:42:15]</span>
                <span className="text-white shrink-0">INFO:</span>
                <span>
                  Establishing secure bridge to database_cluster_01... <span className="text-[#00FF66]">[DONE]</span>
                </span>
              </div>
              <div className="flex space-x-4 mb-2 text-gray-500">
                <span className="text-[#FF8A00] shrink-0">[09:12:03]</span>
                <span className="text-red-500 font-bold shrink-0">WARN:</span>
                <span>High latency detected on port 8080. Redirecting to backup channel.</span>
              </div>
              <div className="flex space-x-4 mb-2 text-gray-500">
                <span className="text-[#FF8A00] shrink-0">[10:05:44]</span>
                <span className="text-white shrink-0">INFO:</span>
                <span>Scheduled backup process initiated. Targeting: /mnt/data/nacho_core_v2/</span>
              </div>
              <div className="flex space-x-4 mb-2 text-gray-500">
                <span className="text-[#FF8A00] shrink-0">[10:05:48]</span>
                <span className="text-white shrink-0">INFO:</span>
                <span>Encryption phase 1/4 completed. RSA-4096 key validated.</span>
              </div>
              <div className="flex space-x-4 mb-2 text-gray-500 opacity-40">
                <span className="text-[#FF8A00] shrink-0">[11:21:00]</span>
                <span className="text-white shrink-0">INFO:</span>
                <span>Background task: 'garbage_collector' reclaimed 450MB system memory.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

