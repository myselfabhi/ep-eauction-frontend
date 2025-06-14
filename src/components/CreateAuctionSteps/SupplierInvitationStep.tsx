export default function SupplierInvitationStep() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Select and invite suppliers</h2>
      <p className="text-sm text-[#5E5E65] mb-4">
        Only invited suppliers will receive access to this auction
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Supplier Email Addresses</label>
          <input
            type="text"
            placeholder="Supplier Email Addresses"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Selection Dropdown (1 Selected)</label>
          <select className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm appearance-none">
            <option>Select from supplier list</option>
            <option>Supplier 1</option>
            <option>Supplier 2</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Preview Email Invitation</label>
        <textarea
          placeholder="Hey, you are invited to the auction..."
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          rows={6}
        ></textarea>
      </div>
    </div>
  );
}
