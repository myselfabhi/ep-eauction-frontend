"use client";

import * as React from "react";
import { ChevronDownIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// --- Types ---
type AuctionSettingsData = {
  startTime?: string;
  endTime?: string;
  autoExtension?: boolean;
  allowPause?: boolean;
  extensionMinutes?: number;
};

type AuctionSettingsStepProps = {
  data: AuctionSettingsData;
  onChange: (data: Partial<AuctionSettingsData>) => void;
  showErrors?: boolean;
};

function combineDateAndTime(date?: Date, time?: string): string | undefined {
  if (!date || !time) return undefined;
  const [hours, minutes, seconds = "00"] = time.split(":");
  const result = new Date(date);
  result.setHours(Number(hours));
  result.setMinutes(Number(minutes));
  result.setSeconds(Number(seconds));
  return result.toISOString();
}

function getDateAndTimeParts(isoString?: string): [Date | undefined, string] {
  if (!isoString) return [undefined, ""];
  const dateObj = new Date(isoString);
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");
  return [dateObj, `${hours}:${minutes}:${seconds}`];
}

// --- Inline Tooltip Component ---
function InfoTooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        className="p-0.5 rounded-full text-gray-400 hover:text-blue-700 focus:text-blue-700"
        tabIndex={0}
        aria-label="Info"
      >
        <Info size={16} />
      </button>
      {open && (
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 w-64 bg-white border border-gray-300 text-xs text-gray-700 rounded shadow-lg p-2 z-50"
          tabIndex={-1}
        >
          {children}
        </div>
      )}
    </span>
  );
}

export default function AuctionSettingsStep({
  data,
  onChange,
  showErrors,
}: AuctionSettingsStepProps) {
  // For Start
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    getDateAndTimeParts(data.startTime)[0]
  );
  const [startTime, setStartTime] = React.useState(
    getDateAndTimeParts(data.startTime)[1] || "10:00:00"
  );
  // For End
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    getDateAndTimeParts(data.endTime)[0]
  );
  const [endTime, setEndTime] = React.useState(
    getDateAndTimeParts(data.endTime)[1] || "12:00:00"
  );

  // Keep parent state in sync when date/time changes
  React.useEffect(() => {
    onChange({
      startTime: combineDateAndTime(startDate, startTime),
      endTime: combineDateAndTime(endDate, endTime),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, startTime, endDate, endTime]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">
        Set auction behavior and schedule
      </h2>
      <p className="text-sm text-[#5E5E65] mb-8">
        Configure timing, rules, and auction type
      </p>
      <div className="grid grid-cols-2 gap-4 rounded">
        {/* --- Start Date & Time --- */}
        <div>
          <Label className="block text-sm mb-1">Auction Start Date & Time</Label>
          <div className="flex gap-4">
            {/* Date */}
            <div className="flex flex-col gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-36 justify-between font-normal ${
                      showErrors && !startDate ? "border-red-500" : ""
                    }`}
                  >
                    {startDate
                      ? startDate.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={startDate}
                    captionLayout="dropdown"
                    onSelect={(date: Date | undefined) => setStartDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Time */}
            <div className="flex flex-col gap-3">
              <Input
                type="time"
                step="1"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background appearance-none min-w-[100px]"
              />
            </div>
          </div>
          {showErrors && !startDate && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        {/* --- End Date & Time --- */}
        <div>
          <Label className="block text-sm mb-1">Auction End Date & Time</Label>
          <div className="flex gap-4">
            {/* Date */}
            <div className="flex flex-col gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-36 justify-between font-normal ${
                      showErrors && !endDate ? "border-red-500" : ""
                    }`}
                  >
                    {endDate
                      ? endDate.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={endDate}
                    captionLayout="dropdown"
                    onSelect={(date: Date | undefined) => setEndDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Time */}
            <div className="flex flex-col gap-3">
              <Input
                type="time"
                step="1"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background appearance-none min-w-[100px]"
              />
            </div>
          </div>
          {showErrors && !endDate && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        {/* --- Auto Extension with Tooltip --- */}
        <div className="flex items-center gap-2 col-span-2">
          <input
            id="auto-extension"
            type="checkbox"
            checked={!!data.autoExtension}
            onChange={(e) => onChange({ autoExtension: e.target.checked })}
            className="w-4 h-4"
          />
          <label
            htmlFor="auto-extension"
            className="block text-sm flex items-center gap-1"
          >
            Enable Auto Extension
            <InfoTooltip>
              If enabled, the auction end time will be extended by <b>3 minutes</b> each time a new highest bid is placed within the final 3 minutes. This ensures fair competition and prevents last-second bidding.
            </InfoTooltip>
          </label>
        </div>
        {data.autoExtension && (
          <div className="col-span-2 text-xs text-gray-500  ml-6">
            <span>
              When enabled, if a new highest bid is placed in the last 3 minutes of the auction, the end time will automatically be extended by 3 minutes.
            </span>
          </div>
        )}

        {/* --- Extension Minutes (Optional Customization) --- */}
        {/* If you want a user-set value, show this. If always 3, comment/remove. */}
        {/* {data.autoExtension && (
          <div>
            <label className="block text-sm mb-1">Extension Minutes</label>
            <Input
              type="number"
              placeholder="e.g. 3"
              className="w-full border px-3 py-2 rounded text-sm border-[#DDE1EB]"
              value={data.extensionMinutes ?? "3"}
              onChange={(e) =>
                onChange({
                  extensionMinutes: Number(e.target.value) || undefined,
                })
              }
              min={1}
            />
          </div>
        )} */}

        {/* --- Allow Pause --- */}
        <div className="flex items-center gap-2 col-span-2">
          <input
            id="allow-pause"
            type="checkbox"
            checked={!!data.allowPause}
            onChange={(e) => onChange({ allowPause: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="allow-pause" className="block text-sm">
            Allow Pause/Resume During Auction
          </label>
        </div>
      </div>
    </div>
  );
}
