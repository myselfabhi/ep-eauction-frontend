export default function ProductLotStep() {
  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Add product or LOT-level information</h2>
          <p className="text-sm text-[#5E5E65]">
            Enter key details for the products being auctioned
          </p>
        </div>
        <button
          onClick={() => alert('Add New LOT')}
          className="flex items-center gap-2 border border-[#DDE1EB] px-4 py-2 rounded text-sm text-[#383838] font-medium"
        >
          + New Lot
        </button>
      </div>

      <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">LOT ID / Product ID</label>
            <input
              type="text"
              placeholder="LOT ID / Product ID"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">HS Code</label>
            <input
              type="text"
              placeholder="HS Code"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Material Type</label>
            <input
              type="text"
              placeholder="Material Type"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Previous landed cost</label>
            <input
              type="text"
              placeholder="Previous landed cost"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">Dimensions</label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="L"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            />
            <input
              type="text"
              placeholder="W"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            />
            <input
              type="text"
              placeholder="H"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
