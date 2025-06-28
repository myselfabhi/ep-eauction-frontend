import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const famousCurrencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "GBP", name: "British Pound" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
];

export function CurrencyRateModal({
  open,
  onClose,
  onSave,
  initialData = {},
  mode = "add"
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { currency: string; code: string; rate: number }) => void;
  initialData?: { currency?: string; code?: string; rate?: number };
  mode?: "add" | "edit";
}) {
  // Figure out if code is famous or custom, for editing mode
  const famousCode = famousCurrencies.some(cur => cur.code === initialData.code);
  const [selectedCode, setSelectedCode] = React.useState(
    mode === "edit"
      ? (famousCode ? initialData.code : "other")
      : ""
  );
  const [customCode, setCustomCode] = React.useState(
    mode === "edit" && !famousCode ? (initialData.code || "") : ""
  );
  const [currency, setCurrency] = React.useState(initialData.currency || "");
  const [rate, setRate] = React.useState(initialData.rate !== undefined ? String(initialData.rate) : "");

  // When code changes, update currency name if possible
  React.useEffect(() => {
    if (selectedCode && selectedCode !== "other") {
      const famous = famousCurrencies.find(cur => cur.code === selectedCode);
      setCurrency(famous?.name || "");
    } else if (mode === "add") {
      setCurrency("");
    }
  }, [selectedCode, mode]);

  // Reset fields when modal opens
  React.useEffect(() => {
    if (open) {
      const isFamous = famousCurrencies.some(cur => cur.code === initialData.code);
      setSelectedCode(
        mode === "edit"
          ? (isFamous ? initialData.code : "other")
          : ""
      );
      setCustomCode(
        mode === "edit" && !isFamous ? (initialData.code || "") : ""
      );
      setCurrency(initialData.currency || "");
      setRate(initialData.rate !== undefined ? String(initialData.rate) : "");
    }
  }, [open, initialData, mode]);

  const code = selectedCode === "other" ? customCode.toUpperCase().slice(0, 3) : selectedCode;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !rate || !currency) return;
    onSave({
      currency: currency.trim(),
      code,
      rate: parseFloat(rate),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Currency Rate" : "Add Currency Rate"}</DialogTitle>
          <DialogDescription>
            Add or edit an exchange rate for a currency (to GBP).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-1">Currency Code</label>
            <select
              className="w-full border border-borderInput rounded p-2 text-sm"
              value={selectedCode}
              onChange={e => setSelectedCode(e.target.value)}
              disabled={mode === "edit"}
              required
            >
              <option value="" disabled>
                Select Currency Code
              </option>
              {famousCurrencies.map(cur => (
                <option key={cur.code} value={cur.code}>{cur.code}</option>
              ))}
              <option value="other">Other (type manually)</option>
            </select>
            {selectedCode === "other" && (
              <Input
                className="mt-2"
                placeholder="Enter 3-letter code (e.g. INR)"
                value={customCode}
                maxLength={3}
                onChange={e => setCustomCode(e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase())}
                disabled={mode === "edit"}
                required
              />
            )}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Currency Name</label>
            <Input
              placeholder="Currency Name (e.g. Indian Rupee)"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              required
              disabled={selectedCode !== "other"}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Exchange Rate (to GBP)</label>
            <Input
              placeholder="Exchange Rate (to GBP)"
              type="number"
              step="0.0001"
              value={rate}
              onChange={e => setRate(e.target.value)}
              required
              min={0}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">{mode === "edit" ? "Save Changes" : "Add Rate"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
