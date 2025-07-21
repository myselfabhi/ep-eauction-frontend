// components/AuctionMonitor/AuctionLotMonitorHeader.tsx
import { Pause, Play } from 'lucide-react';

type Props = {
  auctionTitle: string;
  auctionCode: string;
  invitedSuppliersCount: number;
  status: string;
  autoExtension: boolean;
  endTime: string;
  onPause: () => void;
  onResume: () => void;
  isPaused: boolean;
  isActionLoading: boolean;
  timeRemaining: number;
  onViewDetails?: () => void;
  onViewSuppliers?: () => void;
};

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600).toString().padStart(2, '0');
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function AuctionLotMonitorHeader({
  auctionTitle,
  auctionCode,
  invitedSuppliersCount,
//   status,
  autoExtension,
  endTime,
  onPause,
  onResume,
  isPaused,
  isActionLoading,
  timeRemaining,
  onViewSuppliers,
}: Props) {
  return (
    <div
      className="w-full flex flex-col md:flex-row justify-between items-start md:items-start gap-x-20 gap-y-0"
      style={{ minHeight: 100, maxWidth: 1200 }}
    >
      {/* LEFT: Auction Details */}
      <div style={{ minWidth: 350 }}>
        <div className="text-3xl font-semibold text-gray-800 mb-3">
          {auctionTitle}
        </div>
        <div className="flex items-center text-md text-gray-600 gap-2 mb-3">
          <span>
            <span className="font-medium text-gray-900">Auction ID:</span> {auctionCode}
          </span>
          <span className="text-gray-300 font-normal select-none">|</span>
        </div>

        {/* Info grid */}
        <div className="flex flex-row gap-12 items-end mt-4">
          <div>
            <span className="text-gray-500 block mb-1">Invited suppliers</span>
            <span className="font-medium text-gray-900">
              {invitedSuppliersCount}{' '}
              <button
                type="button"
                className="text-blue-600 underline underline-offset-2 ml-1 font-normal"
                style={{ fontSize: '12px', padding: 0 }}
                onClick={onViewSuppliers}
              >
                View list
              </button>
            </span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Status</span>
            <span className="text-green-600 font-medium">Live</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1 flex items-center gap-1">
              Automatic Extension
            </span>
            <span className="text-gray-600 font-medium">{autoExtension ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Closing</span>
            <span className="text-gray-900 font-medium">
              {new Date(endTime).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'GMT',
                timeZoneName: 'short',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Action + Status */}
      <div className="flex flex-col items-end mt-3 md:mt-0" style={{ minWidth: 265 }}>
        <div className="flex gap-2 mb-10">
          <button
            onClick={onPause}
            disabled={isPaused || isActionLoading}
            className={`inline-flex items-center gap-1 px-4 py-1.5 border rounded-full text-sm font-medium bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-60`}
          >
            <Pause className="w-4 h-4 mr-1" /> Pause auction
          </button>
          <button
            onClick={onResume}
            disabled={!isPaused || isActionLoading}
            className={`inline-flex items-center gap-1 px-4 py-1.5 border rounded-full text-sm font-medium bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-60`}
          >
            <Play className="w-4 h-4 mr-1" /> Resume Auction
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 border border-red-100 text-red-600 font-semibold text-sm shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-400 mr-1 animate-pulse"></span>
          Auction Live
          <span className="ml-2 font-normal" style={{ letterSpacing: 0 }}>
            {formatTime(timeRemaining)} Time Remaining
          </span>
        </div>
      </div>
    </div>
  );
}
