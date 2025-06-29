import { Award, Coins, Users, FileText } from 'lucide-react';

export type LotTab = { id: string; label: string };
export type Summary = {
  bestLandedCost: string;
  bestSupplier: string;
  estimatedSavings: string;
  savingsNote: string;
  previousCost: string;
  previousNote: string;
  activeBidders: number;
};
export type BidRow = {
  id: string;
  rank: number;
  lotId: string;
  product: string;
  supplier: string;
  fobCost: string;
  freight: string;
  duty: string;
  landedCost: number;
  bidTime: string;
};

type Props = {
  lots: LotTab[];
  selectedLotId: string;
  onSelectLot: (id: string) => void;
  summary: Summary;
  bids: BidRow[];
};

export default function AuctionLotSummaryTable({
  lots,
  selectedLotId,
  onSelectLot,
  summary,
  bids,
}: Props) {
  const bestLandedCost = bids.length
    ? Math.min(...bids.map((b) => b.landedCost))
    : null;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl shadow-sm p-0">
      {/* LOT Tabs */}
      <div className="flex gap-2 border-b border-[#ececec] px-6 pt-4">
        {lots.map((lot) => (
          <button
            key={lot.id}
            onClick={() => onSelectLot(lot.id)}
            className={`px-5 py-1 rounded-t-xl font-medium text-sm border-none outline-none
              ${selectedLotId === lot.id
                ? 'bg-white text-blue-700 border-b-2 border-blue-600 shadow'
                : 'bg-[#f8fafd] text-[#222] hover:bg-[#f3f5f8]'}`
            }
            style={{ borderBottom: selectedLotId === lot.id ? '2px solid #2563eb' : '2px solid transparent' }}
          >
            {lot.label}
          </button>
        ))}
      </div>

      {/* LOT SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-[#ececec] bg-[#fcfcfd]">
        <div className="flex items-center gap-3">
          <Coins className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-xs text-gray-600 mb-1">Best Landed Cost</div>
            <div className="font-bold text-xl text-green-700">{summary.bestLandedCost}</div>
            <div className="text-xs text-gray-400">{summary.bestSupplier}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-yellow-600" />
          <div>
            <div className="text-xs text-gray-600 mb-1">Estimated Savings</div>
            <div className="font-bold text-xl text-yellow-700">{summary.estimatedSavings}</div>
            <div className="text-xs text-gray-400">{summary.savingsNote}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs text-gray-600 mb-1">Previous Cost</div>
            <div className="font-bold text-xl text-blue-700">{summary.previousCost}</div>
            <div className="text-xs text-gray-400">{summary.previousNote}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-xs text-gray-600 mb-1">Active Bidders</div>
            <div className="font-bold text-xl">{summary.activeBidders}</div>
          </div>
        </div>
      </div>

      {/* ACTIVE BIDS */}
      <div className="p-6">
        <div className="font-semibold mb-2 text-[#333]">
          ACTIVE BIDS <span className="font-normal text-gray-400">{bids.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f9f9fa]">
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Rank</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">LOT ID</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Product</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Suppliers</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">FOB Cost</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Freight/Cart.</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Duty %</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Landed Cost (GBP)</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Bid time</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr
                  key={bid.id}
                  className={`
                    ${bid.landedCost === bestLandedCost ? 'bg-[#f4faed]' : ''}
                    border-b border-[#ededed] last:border-0
                  `}
                >
                  <td className="px-3 py-2 font-semibold text-green-700 text-xs">
                    <span className="px-2 py-0.5 rounded-full border border-green-600 bg-green-50">
                      #{bid.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm font-mono">{bid.lotId}</td>
                  <td className="px-3 py-2 text-sm">{bid.product}</td>
                  <td className="px-3 py-2 text-sm">{bid.supplier}</td>
                  <td className="px-3 py-2 text-sm text-right">{bid.fobCost}</td>
                  <td className="px-3 py-2 text-sm text-right">{bid.freight}</td>
                  <td className="px-3 py-2 text-sm text-right">{bid.duty}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-right text-green-700">{bid.landedCost.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-right">{bid.bidTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
