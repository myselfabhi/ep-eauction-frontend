import React from "react";

type AuctionSettingsData = {
  startTime?: string;
  endTime?: string;
  autoExtension?: boolean;
  allowPause?: boolean;
};

type AuctionSettingsStepProps = {
  data: AuctionSettingsData;
  onChange: (data: Partial<AuctionSettingsData>) => void;
  showErrors?: boolean;
};

export default function AuctionSettingsStep({
  data,
  onChange,
  showErrors,
}: AuctionSettingsStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Set auction behavior and schedule</h2>
      <p className="text-sm text-[#5E5E65] mb-8">
        Configure timing, rules, and auction type
      </p>

      <div className="grid grid-cols-2 gap-4 rounded">
        <div>
          <label className="block text-sm mb-1">Auction Start Date & Time</label>
          <input
            type="datetime-local"
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.startTime ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.startTime || ''}
            onChange={(e) => onChange({ startTime: e.target.value })}
          />
          {showErrors && !data.startTime && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Auction End Date & Time</label>
          <input
            type="datetime-local"
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.endTime ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.endTime || ''}
            onChange={(e) => onChange({ endTime: e.target.value })}
          />
          {showErrors && !data.endTime && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="auto-extension"
            type="checkbox"
            checked={!!data.autoExtension}
            onChange={(e) => onChange({ autoExtension: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="auto-extension" className="block text-sm mb-1">
            Enable Auto Extension
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="allow-pause"
            type="checkbox"
            checked={!!data.allowPause}
            onChange={(e) => onChange({ allowPause: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="allow-pause" className="block text-sm mb-1">
            Allow Pause/Resume During Auction
          </label>
        </div>
      </div>
    </div>
  );
}
