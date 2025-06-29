import { Clock, Pause, Play, Users } from 'lucide-react';

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
  status,
  autoExtension,
  endTime,
  onPause,
  onResume,
  isPaused,
  isActionLoading,
  timeRemaining,
  onViewDetails,
  onViewSuppliers,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <span className="font-semibold text-gray-600">Auction Code:</span>
          <span className="font-mono bg-gray-100 rounded px-2 py-0.5">{auctionCode}</span>
          <span className="mx-2">|</span>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
              status === 'Live'
                ? 'bg-red-100 text-red-600'
                : status === 'Paused'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {status}
          </span>
          <span className="mx-2">|</span>
          <span>
            Closes:&nbsp;
            <span className="font-mono">{new Date(endTime).toLocaleString()}</span>
          </span>
          {autoExtension && (
            <>
              <span className="mx-2">|</span>
              <span className="text-blue-600 font-semibold">Auto-extension</span>
            </>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{auctionTitle}</h1>
        <div className="text-gray-500 text-sm flex items-center gap-3">
          <Users className="inline w-4 h-4" />
          Invited suppliers: <span className="font-semibold">{invitedSuppliersCount}</span>
          {onViewSuppliers && (
            <button
              onClick={onViewSuppliers}
              className="ml-2 text-blue-600 underline underline-offset-2 text-xs"
              type="button"
            >
              View
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
        <button
          onClick={isPaused ? onResume : onPause}
          disabled={isActionLoading}
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition
            ${
              isPaused
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }
            border border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isActionLoading
            ? 'Processing...'
            : isPaused
            ? 'Resume Auction'
            : 'Pause Auction'}
        </button>
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border
            ${
              status === 'Live' && !isPaused
                ? 'border-red-200 text-red-600 bg-red-50'
                : status === 'Paused'
                ? 'border-yellow-300 text-yellow-700 bg-yellow-50'
                : 'border-gray-200 text-gray-500 bg-gray-50'
            }
          `}
        >
          <Clock className="w-4 h-4" />
          {status === 'Live' && !isPaused
            ? `Auction Live | ${formatTime(timeRemaining)}`
            : isPaused
            ? 'Paused'
            : status === 'Ended'
            ? 'Ended'
            : 'Scheduled'}
        </div>
      </div>
    </div>
  );
}
