
import React, { useState } from 'react';
import { Brain, Zap, Target, TrendingUp, RefreshCw, Rocket } from 'lucide-react';
// Fix: Use Signal instead of Round and calculateSignal instead of getPrediction.
import { Signal, PredictionResult } from '../types';
import { calculateSignal } from '../services/geminiService';

interface PredictorPanelProps {
  history: Signal[];
}

const PredictorPanel: React.FC<PredictorPanelProps> = ({ history }) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (history.length < 3) {
      alert("Need at least some history for Joe's jetpack analysis.");
      return;
    }
    setLoading(true);
    // Fix: Use the renamed exported function calculateSignal.
    const result = await calculateSignal(history);
    setPrediction(result);
    setLoading(false);
  };

  return (
    <div className="bg-[#0b0e14] border border-indigo-500/20 rounded-2xl p-6 h-full flex flex-col shadow-2xl shadow-indigo-500/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Rocket className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-bold text-white">Jet AI Analysis</h2>
            <div className="text-[10px] text-indigo-400 tracking-widest font-bold">1WIN.NG PREDICTOR</div>
          </div>
        </div>
        <button 
          onClick={handlePredict}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/40 active:scale-95"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {loading ? 'CALCULATING...' : 'GET PREDICTION'}
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {!prediction && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center py-12 opacity-60">
            <div className="relative mb-6">
              <Brain className="w-16 h-16 opacity-20" />
              <div className="absolute inset-0 bg-indigo-500/10 blur-xl"></div>
            </div>
            <p className="font-medium text-slate-400">Joe is ready for takeoff.<br/>Scan historical data for patterns.</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <div className="h-24 bg-indigo-900/10 animate-pulse rounded-xl border border-indigo-500/10"></div>
            <div className="h-32 bg-indigo-900/10 animate-pulse rounded-xl border border-indigo-500/10"></div>
            <div className="h-24 bg-indigo-900/10 animate-pulse rounded-xl border border-indigo-500/10"></div>
          </div>
        )}

        {prediction && !loading && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-900/20 to-transparent p-4 rounded-xl border border-indigo-500/20">
                <div className="flex items-center gap-2 text-indigo-400 text-[10px] uppercase font-bold mb-1">
                  <Target className="w-3 h-3" /> Withdraw Target
                </div>
                {/* Fix: use nextSignal instead of nextTarget to match PredictionResult type */}
                <div className="text-3xl font-orbitron font-bold text-yellow-400">
                  {prediction.nextSignal.toFixed(2)}x
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/20 to-transparent p-4 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-400 text-[10px] uppercase font-bold mb-1">
                  <TrendingUp className="w-3 h-3" /> Confidence
                </div>
                {/* Fix: use confidence instead of probability to match PredictionResult type */}
                <div className="text-3xl font-orbitron font-bold text-white">
                  {prediction.confidence}
                </div>
              </div>
            </div>

            <div className="bg-[#161b22] border border-indigo-500/20 p-5 rounded-xl">
              <h3 className="text-indigo-300 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" /> AI Pattern Logic
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "{prediction.analysis}"
              </p>
            </div>

            <div className="bg-yellow-400/5 border border-yellow-400/20 p-5 rounded-xl">
              <h3 className="text-yellow-400 text-xs font-bold uppercase mb-2">1Win Strategy Hint</h3>
              {/* Fix: use entryTime and riskLevel as the strategy field is not present in the type */}
              <p className="text-slate-200 text-sm">
                Recommended Entry: {prediction.entryTime}. Risk level is currently {prediction.riskLevel}.
              </p>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-800 text-[9px] text-slate-500 uppercase text-center leading-tight">
        LUCKY JET PREDICTOR IS AN ANALYTICAL TOOL FOR ENTERTAINMENT.<br/>
        PROBABILITY DATA IS BASED ON PREVIOUS RESULTS ONLY.
      </div>
    </div>
  );
};

export default PredictorPanel;
