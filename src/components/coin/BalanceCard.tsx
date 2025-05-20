interface BalanceCardProps {
  totalBalance: string;
}

export default function BalanceCard({ totalBalance }: BalanceCardProps) {
  return (
    <div className="m-6 rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      <p className="mb-2 text-lg text-gray-500">총 자산</p>
      <h2 className="text-4xl font-bold text-black">{totalBalance}</h2>
    </div>
  );
}