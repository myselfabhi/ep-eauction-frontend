export default function ReviewLaunchStep() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Review & Launch</h2>
      <p className="text-sm text-[#5E5E65] mb-4">
        This is your final opportunity to review the auction details before launching.
      </p>
      <div className="border border-[#EAECF0] rounded p-6 bg-[#F9FAFB] max-h-[500px] overflow-y-auto space-y-6">
        <div>
          <h3 className="text-base font-semibold mb-2">Auction Details</h3>
          <p className="text-sm mb-1"><strong>Title:</strong> Sample Auction Title</p>
          <p className="text-sm mb-1"><strong>Type:</strong> Single LOT</p>
          <p className="text-sm mb-1"><strong>SAP Code:</strong> 12345</p>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-2">Product & LOT</h3>
          <p className="text-sm mb-1"><strong>LOT ID:</strong> LOT-001</p>
          <p className="text-sm mb-1"><strong>HS Code:</strong> 4819.10</p>
          <p className="text-sm mb-1"><strong>Product Name:</strong> Kraft Boxes</p>
          <p className="text-sm mb-1"><strong>Material Type:</strong> Paperboard</p>
          <p className="text-sm mb-1"><strong>Previous Landed Cost:</strong> $500</p>
          <p className="text-sm mb-1"><strong>Dimensions:</strong> L: 10cm, W: 10cm, H: 5cm</p>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-2">Auction Settings</h3>
          <p className="text-sm mb-1"><strong>Start Date & Time:</strong> June 20, 2025, 10:00 AM</p>
          <p className="text-sm mb-1"><strong>End Date & Time:</strong> June 20, 2025, 11:00 AM</p>
          <p className="text-sm mb-1"><strong>Auto Extension:</strong> Enabled</p>
          <p className="text-sm mb-1"><strong>Pause/Resume:</strong> Allowed</p>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-2">Supplier Invitations</h3>
          <p className="text-sm mb-1"><strong>Suppliers:</strong> supplier1@email.com, supplier2@email.com</p>
          <p className="text-sm mb-1"><strong>Email Invitation:</strong> Hey, you are invited to the auction...</p>
        </div>
      </div>
    </div>
  );
}
