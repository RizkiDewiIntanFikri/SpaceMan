import Card from "../ui/Card";
// 1. Import our currency formatter
import { formatCurrency } from "../../utils/formatters";

// We can remove the Pill component as we won't show P&L % here
// function Pill({ v }) { ... }

export default function Podium({ top = [] }) {
  const [gold, silver, bronze] = top;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        {silver ? (
          <PodiumItem place="2" color="text-gray-500" {...silver} />
        ) : (
          <Empty place={2} />
        )}
      </Card>
      <Card>
        {gold ? (
          <PodiumItem place="1" color="text-yellow-600" crown {...gold} />
        ) : (
          <Empty place={1} />
        )}
      </Card>
      <Card>
        {bronze ? (
          <PodiumItem place="3" color="text-amber-700" {...bronze} />
        ) : (
          <Empty place={3} />
        )}
      </Card>
    </div>
  );
}

// 2. Update PodiumItem to use the new data structure
function PodiumItem({ place, crown, color, name, avatar, pnl }) {
  // The 'pnl' prop from the parent now contains the total portfolio value
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`text-sm font-semibold ${color}`}>
        {crown ? "Champion" : `#${place}`}
      </div>
      <img src={avatar} alt={name} className="h-16 w-16 rounded-full mt-2" />
      <div className="mt-2 font-semibold">{name}</div>
      {/* 3. Display the total portfolio value instead of P&L */}
      <div className="mt-1 text-lg font-semibold text-emerald-600">
        {formatCurrency(pnl)}
      </div>
    </div>
  );
}

function Empty({ place }) {
  return (
    <div className="text-sm text-gray-400 text-center py-10">
      Waiting for player #{place}
    </div>
  );
}
