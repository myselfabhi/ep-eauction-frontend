import React from 'react';
import { Award, FileText } from 'lucide-react';

// --- TYPE DEFINITIONS ---
export type SummaryData = {
  bestLandedCost: string;
  bestSupplier: string;
  estimatedSavings: string;
  savingsNote: string;
  previousCost: string;
  previousNote: string;
  activeBidders: number;
};

export type BidRowData = {
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

// --- PROPS ---
type Props = {
  lots: { id: string, label: string }[];
  selectedLotId: string;
  onSelectLot: (id: string) => void;
  summary: SummaryData;
  bids: BidRowData[];
};

export default function AuctionLotSummaryTable({ lots, selectedLotId, onSelectLot, summary, bids }: Props) {
  const bestLandedCost = bids.length ? Math.min(...bids.map((b) => b.landedCost)) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm font-sans mt-12">
      {/* LOT SELECTOR */}
      {lots.length > 1 && (
        <div className="flex gap-2 px-6 pt-6 pb-2">
          {lots.map(lot => (
            <button
              key={lot.id}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${selectedLotId === lot.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              onClick={() => onSelectLot(lot.id)}
            >
              {lot.label}
            </button>
          ))}
        </div>
      )}

      {/* LOT SUMMARY SECTION */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xs text-gray-500 font-semibold tracking-wider mb-4">
          LOT SUMMARY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Best Landed Cost */}
          <div className="flex items-start gap-3 py-2 pr-4">
            <div className="bg-[#e9f8ee] text-green-700 rounded-lg p-2 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Best Landed Cost</div>
              <div className="text-xl font-bold text-gray-900">{summary.bestLandedCost}</div>
              <div className="text-xs text-gray-600 mt-1">{summary.bestSupplier}</div>
            </div>
          </div>

          {/* Estimated Savings */}
          <div className="flex items-start gap-3 py-2 px-4 border-t md:border-t-0 md:border-l border-gray-200 mt-2 pt-4 md:mt-0 md:pt-2">
            <div className="bg-[#fff8e1] text-amber-600 rounded-lg p-2 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Estimated Savings</div>
              <div className="text-xl font-bold text-green-600">{summary.estimatedSavings}</div>
              <div className="text-xs text-gray-600 mt-1">{summary.savingsNote}</div>
            </div>
          </div>

          {/* Previous Cost */}
          <div className="flex items-start gap-3 py-2 px-4 border-t lg:border-t-0 md:border-l border-gray-200 mt-2 pt-4 lg:mt-0 lg:pt-2">
            <div className="bg-[#eef2ff] text-indigo-600 rounded-lg p-2 flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Previous Cost</div>
              <div className="text-xl font-bold text-gray-900">
                {summary.previousCost}
                <span className="text-base font-normal text-gray-500"> {summary.previousNote}</span>
              </div>
            </div>
          </div>
          
          {/* Active Bidders */}
          <div className="flex items-start gap-3 py-2 pl-4 border-t md:border-t-0 md:border-l border-gray-200 mt-2 pt-4 md:mt-0 md:pt-2">
            <div className="bg-[#fff8e1] text-amber-600 rounded-lg p-2 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Active Bidders</div>
              <div className="text-xl font-bold text-gray-900">{summary.activeBidders}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE BIDS TABLE */}
      <div className="px-6 pb-6 pt-4">
        <div className="font-semibold mb-3 text-gray-800 text-sm tracking-wide">
          ACTIVE BIDS <span className="font-normal text-gray-500">{bids.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm w-full">
            <thead>
              <tr className="text-xs text-gray-500 font-medium bg-gray-50">
                <th className="text-left px-4 py-3">Rank</th>
                <th className="text-left px-4 py-3">LOT ID</th>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Suppliers</th>
                <th className="text-left px-4 py-3">FOB Cost</th>
                <th className="text-left px-4 py-3">Freight/Cart.</th>
                <th className="text-left px-4 py-3">Duty %</th>
                <th className="text-left px-4 py-3">Landed Cost (GBP)</th>
                <th className="text-left px-4 py-3">Bid time</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr
                  key={bid.id}
                  className={`border-b border-gray-100 last:border-b-0
                    ${bid.landedCost === bestLandedCost ? 'bg-lime-50' : 'bg-white'}
                  `}
                >
                  <td className="px-4 py-3 font-bold text-green-700">
                    #{bid.rank}
                  </td>
                  <td className="px-4 py-3 text-gray-700">LOT-{bid.lotId}</td>
                  <td className="px-4 py-3 text-gray-700">{bid.product}</td>
                  <td className="px-4 py-3 text-gray-700">{bid.supplier}</td>
                  <td className="px-4 py-3 text-gray-700">{bid.fobCost}</td>
                  <td className="px-4 py-3 text-gray-700">{bid.freight}</td>
                  <td className="px-4 py-3 text-gray-700">{bid.duty}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">£{bid.landedCost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{bid.bidTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}