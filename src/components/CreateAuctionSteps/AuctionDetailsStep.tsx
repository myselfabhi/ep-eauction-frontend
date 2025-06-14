export default function AuctionDetailsStep() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Enter basic auction information</h2>
      <p className="text-sm text-[#5E5E65] mb-6">
        Enter the auction title and related reference details
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            placeholder="Auction title"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Auction Type</label>
          <input
            type="text"
            placeholder="Single LOTs / Multiple LOTs"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">SAP Code</label>
          <input
            type="text"
            placeholder="Auction title"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
}