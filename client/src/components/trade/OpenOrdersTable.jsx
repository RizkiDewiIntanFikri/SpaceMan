import Card from "../ui/Card";

export default function OpenOrdersTable() {
  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-3">Open Orders</div>
      <div className="text-sm text-gray-500">
        Limit orders are not supported in the current version.
      </div>
    </Card>
  );
}
