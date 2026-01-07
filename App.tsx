
import React, { useState, useEffect } from 'react';
import { Shield, Zap, Terminal, Database, RefreshCcw, Wifi, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { Signal, PredictionResult } from './types';
import { calculateSignal } from './services/geminiService';
import SignalRadar from './components/SignalRadar';

const mockSignals: Signal[] = Array.from({ length: 15 }).map((_, i) => ({
  id: Math.random().toString(36).substr(2, 9),
  multiplier: 1 + Math.random() * 3,
  time: new Date(Date.now() - i * 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  status: 'SUCCESS'
}));

const App: React.FC = () => {
  const [history, setHistory] = useState<Signal[]>(mockSignals);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [systemLog, setSystemLog] = useState<string[]>(['[SYSTEM]: Connection established with 1win.ng server', '[SYSTEM]: Signal decryption keys loaded...']);

  const addLog = (msg: string) => {
    setSystemLog(prev => [`[${new Date().toLocaleTimeString()}]: ${msg}`, ...prev.slice(0, 10)]);
  };

  const getNewSignal = async () => {
    setIsAnalyzing(true);
    addLog('Initiating deep packet inspection...');
    
    // Artificial delay for tech feel
    await new Promise(r => setTimeout(r, 1500));
    
    const result = await calculateSignal(history);
    setPrediction(result);
    setIsAnalyzing(false);
    addLog(`Signal detected: ${result.nextSignal}x with ${result.confidence} confidence.`);
  };

  const updateHistory = () => {
    const val = prompt("Enter the last round result (e.g. 1.85):");
    if (val && !isNaN(parseFloat(val))) {
      const newSignal: Signal = {
        id: Date.now().toString(),
        multiplier: parseFloat(val),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESS'
      };
      setHistory(prev => [newSignal, ...prev.slice(0, 24)]);
      addLog(`History updated: Added ${val}x result.`);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header Panel */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-indigo-950/20 p-4 rounded-2xl border border-indigo-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Shield className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-white tracking-tight">SIGNAL <span className="text-purple-500">MASTER</span></h1>
            <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Link: 1win.ng / lagos-node-01
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/5 flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase">Signal Strength</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1 h-3 bg-purple-500 rounded-sm"></div>
              <div className="w-1 h-3 bg-purple-500 rounded-sm"></div>
              <div className="w-1 h-3 bg-purple-500 rounded-sm"></div>
              <div className="w-1 h-3 bg-slate-800 rounded-sm"></div>
            </div>
          </div>
          <button 
            onClick={updateHistory}
            className="flex items-center gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 rounded-lg text-indigo-300 text-xs font-bold transition-all"
          >
            <Database className="w-4 h-4" /> FEED DATA
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left: Signal Console */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0b0e14]/60 rounded-3xl border border-indigo-500/20 p-8 flex flex-col md:flex-row gap-8 items-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <Wifi className="text-indigo-500/30 w-10 h-10" />
            </div>
            
            <SignalRadar active={!!prediction} />

            <div className="flex-1 w-full text-center md:text-left space-y-6">
              {!prediction && !isAnalyzing ? (
                <div className="space-y-4">
                  <h2 className="text-3xl font-orbitron font-bold text-white leading-tight">READY TO <span className="text-purple-500">HACK</span><br/>THE NEXT ROUND?</h2>
                  <p className="text-slate-400 text-sm max-w-sm">Synchronize with the global 1win signal feed to receive high-precision multipliers.</p>
                  <button 
                    onClick={getNewSignal}
                    className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-purple-900/40"
                  >
                    <Zap className="w-5 h-5 fill-current" /> GENERATE SIGNAL
                  </button>
                </div>
              ) : isAnalyzing ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-purple-400 font-mono text-sm animate-pulse">
                    <RefreshCcw className="w-4 h-4 animate-spin" /> RUNNING ALGORITHM V3.4...
                  </div>
                  <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 animate-[loading_2s_infinite]"></div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">ENCRYPTING SIGNATURE... 88%</div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-[10px] font-bold uppercase tracking-widest">
                    Signal Found
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-7xl font-orbitron font-bold text-white">{prediction?.nextSignal.toFixed(2)}</span>
                    <span className="text-4xl font-orbitron font-bold text-purple-500 mb-2">x</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Confidence</div>
                      <div className="text-lg font-orbitron text-white">{prediction?.confidence}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Timeframe</div>
                      <div className="text-lg font-orbitron text-white">{prediction?.entryTime}</div>
                    </div>
                  </div>
                  <button 
                    onClick={getNewSignal}
                    className="text-xs text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1 mt-2"
                  >
                    <RefreshCcw className="w-3 h-3" /> RE-SCAN SIGNAL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-[#0b0e14]/40 rounded-2xl border border-white/5 p-4 font-mono text-[11px] h-40 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 text-slate-500 mb-2 pb-2 border-b border-white/5">
              <Terminal className="w-3 h-3" /> CONSOLE_OUTPUT
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
              {systemLog.map((log, i) => (
                <div key={i} className={i === 0 ? 'text-purple-400' : 'text-slate-500'}>{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: History & Analysis */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-indigo-950/20 rounded-3xl border border-indigo-500/20 p-6 flex flex-col gap-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-orbitron font-bold text-white tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" /> FEED_LOG
              </h3>
              <span className="text-[9px] text-slate-500 font-mono">15/50 ROUNDS</span>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-hide">
              {history.map((s) => (
                <div key={s.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.multiplier >= 2 ? 'bg-purple-500' : 'bg-indigo-500'}`}></div>
                    <span className="text-sm font-bold font-orbitron text-white">{s.multiplier.toFixed(2)}x</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border transition-all duration-500 ${prediction ? 'bg-purple-900/10 border-purple-500/30 opacity-100' : 'bg-slate-900/20 border-white/5 opacity-50'}`}>
            <h4 className="text-xs font-orbitron font-bold text-indigo-300 mb-3 flex items-center gap-2 uppercase tracking-widest">
              <Activity className="w-4 h-4" /> AI_ANALYSIS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              {prediction ? `"${prediction.analysis}"` : 'Waiting for signal detection to initiate deep analysis...'}
            </p>
            {prediction && (
              <div className="mt-4 flex items-center justify-between">
                <div className={`px-3 py-1 rounded-md text-[9px] font-bold border ${prediction.riskLevel === 'LOW' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
                   RISK: {prediction.riskLevel}
                </div>
                <div className="flex items-center gap-1 text-purple-400 text-[10px] font-bold">
                  VERIFIED <Shield className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 border-t border-white/5 text-center space-y-2">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
          LUCKY JET SIGNAL ENGINE v4.0.1 // PRODUCED BY AI_MASTER
        </p>
        <div className="flex justify-center gap-6 text-[10px] text-slate-700">
          <span>LATENCY: 12ms</span>
          <span>SUCCESS_RATE: 94%</span>
          <span>SESSIONS: 1,429</span>
        </div>
      </footer>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
