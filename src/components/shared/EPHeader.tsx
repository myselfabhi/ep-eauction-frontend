'use client';

export default function EPHeader() {
  return (
    <header className="flex justify-between items-center px-14 py-8 bg-white border-b border-border text-body">
      <div className="text-xl font-bold">EP Auction</div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-medium">
          A
        </div>
        <span className="text-sm">Aakash Bhardwaj</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </header>
  );
}
