import React, { useEffect, useState, useRef } from 'react';

interface LiveChartProps {
  currentPrice: number;
  onPriceUpdate: (newPrice: number) => void;
  entryPrice?: number;
  isActivePrediction?: boolean;
}

export default function LiveChart({
  currentPrice,
  onPriceUpdate,
  entryPrice,
  isActivePrediction,
}: LiveChartProps) {
  const [history, setHistory] = useState<number[]>(() => {
    // Generate initial realistic price history around 1.2500
    const initialHist: number[] = [];
    let start = 1.2500;
    for (let i = 0; i < 40; i++) {
      start += (Math.random() - 0.5) * 0.008;
      initialHist.push(parseFloat(start.toFixed(4)));
    }
    return initialHist;
  });

  const [isUp, setIsUp] = useState(true);
  const historyRef = useRef(history);
  historyRef.current = history;

  // Real-time price flux
  useEffect(() => {
    const interval = setInterval(() => {
      const prevPrice = historyRef.current[historyRef.current.length - 1] || currentPrice;
      const volatility = 0.004;
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = parseFloat((prevPrice + change).toFixed(4));
      
      setIsUp(newPrice >= prevPrice);
      onPriceUpdate(newPrice);
      
      setHistory((prev) => {
        const updated = [...prev.slice(1), newPrice];
        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [currentPrice, onPriceUpdate]);

  // Translate prices to SVG coordinates
  const width = 600;
  const height = 220;
  const minPrice = Math.min(...history) * 0.998;
  const maxPrice = Math.max(...history) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  const points = history.map((price, idx) => {
    const x = (idx / (history.length - 1)) * (width - 20) + 10;
    const y = height - ((price - minPrice) / priceRange) * (height - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  // SVG grid lines data helper
  const gridLinesCount = 5;
  const gridLines = Array.from({ length: gridLinesCount }, (_, i) => {
    const ratio = i / (gridLinesCount - 1);
    const y = 20 + ratio * (height - 40);
    const val = maxPrice - ratio * (maxPrice - minPrice);
    return { y, val: val.toFixed(4) };
  });

  // Calculate Entry Price Y
  const entryY = entryPrice
    ? height - ((entryPrice - minPrice) / priceRange) * (height - 40) - 20
    : null;

  return (
    <div id="live_chart_container" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">ALC / USDT Market</span>
            <span className={`text-2xl font-mono font-bold tracking-tight transition-all duration-300 ${
              isUp ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              ${currentPrice.toFixed(4)}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
            isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {isUp ? '▲ Live' : '▼ Live'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Predict Engine Active</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        {/* SVG Live Chart Line */}
        <svg className="w-full h-full text-slate-400 overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
              <stop offset="100%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor={isUp ? '#34d399' : '#fb7185'} />
              <stop offset="100%" stopColor={isUp ? '#059669' : '#e11d48'} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((line, idx) => (
            <g key={idx} className="opacity-30">
              <line
                id={`grid_line_${idx}`}
                x1="0"
                y1={line.y}
                x2={width}
                y2={line.y}
                stroke="#475569"
                strokeWidth="0.5"
                strokeDasharray="4 6"
              />
              <text
                id={`grid_label_${idx}`}
                x={width - 5}
                y={line.y - 4}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                className="font-mono font-medium"
              >
                ${line.val}
              </text>
            </g>
          ))}

          {/* Area under the line */}
          {history.length > 1 && (
            <path
              id="chart_gradient_area"
              d={`M 10,${height - 20} L ${points} L ${width - 10},${height - 20} Z`}
              fill="url(#chartGlow)"
              className="transition-all duration-300"
            />
          )}

          {/* Connecting line */}
          <polyline
            id="chart_path_line"
            fill="none"
            stroke="url(#chartStroke)"
            strokeWidth="3.5"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Entry Price Line (Dashed Orange Line for Active Predictions) */}
          {isActivePrediction && entryPrice && entryY !== null && (
            <g>
              <line
                id="entry_price_dashed_line"
                x1="10"
                y1={entryY}
                x2={width - 10}
                y2={entryY}
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <rect
                id="entry_price_label_bg"
                x="12"
                y={entryY - 10}
                width="112"
                height="20"
                rx="4"
                fill="#312e81"
                className="opacity-90 stroke stroke-orange-500/50"
                strokeWidth="0.5"
              />
              <text
                id="entry_price_label_text"
                x="16"
                y={entryY + 4}
                fill="#ffedd5"
                fontSize="10"
                className="font-semibold font-mono"
              >
                Locked: ${entryPrice.toFixed(4)}
              </text>
            </g>
          )}

          {/* Glow indicator dot at the latest point */}
          {history.length > 0 && (
            <circle
              id="latest_price_dot"
              cx={(history.length - 1) / (history.length - 1) * (width - 20) + 10}
              cy={height - ((history[history.length - 1] - minPrice) / priceRange) * (height - 40) - 20}
              r="6"
              fill={isUp ? '#34d399' : '#fb7185'}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      <div className="flex justify-between items-center mt-3 text-slate-500 text-[10px] font-semibold tracking-wider font-mono px-1">
        <span>30 SECONDS AGO</span>
        <span>15 SECONDS AGO</span>
        <span>LIVE UPDATING NOW</span>
      </div>
    </div>
  );
}
