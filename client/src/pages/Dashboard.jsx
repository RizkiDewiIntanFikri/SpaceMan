import { useEffect, useState } from "react";
import { useMarketStore } from "../stores/marketStore";
import { startPortfolioAutoRecalc } from "../stores/portfolioStore";
import { useTheme } from "../context/ThemeContext";
import StockCard from "../components/trading/StockCard";
import PortfolioCard from "../components/trading/PortfolioCard";
import TradeTable from "../components/trading/TradeTable";
import BuySellModal from "../components/trading/BuySellModal";
import StockLine from "../components/charts/StockLine";
import PortfolioArea from "../components/charts/PortfolioArea";

export default function Dashboard() {
  const stocks = useMarketStore(s => s.featured);
  const startSocket = useMarketStore(s => s.startSocket);
  const stopSocket = useMarketStore(s => s.stopSocket);
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    startSocket();
    const stopRecalc = startPortfolioAutoRecalc();
    return () => {
      stopSocket();
      stopRecalc?.();
    };
  }, []);

  const bgColor = theme==="light"?"white":"black";
  const borderColor = theme==="light"?"#e5e7eb":"#1f1f1f";
  const textColor = theme==="light"?"black":"white";

  return (
    <div className="space-y-6" style={{color:textColor}}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {stocks.map(s=>(
          <StockCard key={s.symbol} stock={s} style={{backgroundColor:bgColor,borderColor:borderColor,color:textColor}} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 xl:col-span-2" style={{backgroundColor:bgColor,border:`1px solid ${borderColor}`}}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Stock Chart</div>
            <button className="rounded-xl px-3 py-1 text-sm" style={{border:`1px solid ${borderColor}`,color:textColor}} onClick={()=>setOpen(true)}>Buy/Sell</button>
          </div>
          <StockLine />
        </div>
        <PortfolioCard style={{backgroundColor:bgColor,border:`1px solid ${borderColor}`,color:textColor}} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 xl:col-span-2" style={{backgroundColor:bgColor,border:`1px solid ${borderColor}`}}>
          <div className="font-semibold mb-2">Portfolio</div>
          <PortfolioArea />
        </div>
        <TradeTable style={{backgroundColor:bgColor,border:`1px solid ${borderColor}`,color:textColor}} />
      </div>

      <BuySellModal open={open} onClose={()=>setOpen(false)} />
    </div>
  );
}
