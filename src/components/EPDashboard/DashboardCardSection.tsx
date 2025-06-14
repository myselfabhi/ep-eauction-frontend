import Image from 'next/image';

export default function DashboardCardSection() {
  return (
    <>
      {/* Dashboard header + bell */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-body">Dashboard</h1>
          <p className="text-sm text-muted">Create, track, and review auctions</p>
        </div>
        <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
          <Image width={5} height={5} src="/icons/bell.svg" alt="Notifications" className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-status-live" />
              <span className="text-sm font-medium">Active Auctions</span>
            </div>
            <Image width={5} height={5} src="/icons/arrow_right.svg" alt="Chevron" className="w-4 h-4" />
          </div>
          <div className="flex justify-between items-end mt-4">
            <span className="text-4xl font-semibold">3</span>
            <span className="text-status-live text-sm font-semibold">Live</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={5} height={5} src="/icons/block_code.svg" alt="Total Auctions" className="w-4 h-4" />
            Total Auctions
          </div>
          <div className="text-4xl font-semibold mt-4">6</div>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={5} height={5} src="/icons/calendar_clock.svg" alt="Schedule Auction" className="w-4 h-4" />
            Schedule Auction
          </div>
          <div className="text-4xl font-semibold mt-4">2</div>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={5} height={5} src="/icons/group.svg" alt="Total Suppliers" className="w-4 h-4" />
            Total Suppliers
          </div>
          <div className="text-4xl font-semibold mt-4">24</div>
        </div>
      </div>
    </>
  );
}
