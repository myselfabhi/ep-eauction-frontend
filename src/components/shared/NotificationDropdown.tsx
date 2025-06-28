'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';

const notifications = [
  {
    id: 1,
    title: "Food Service Paper... has started",
    link: "Monitor",
    linkUrl: "#",
    time: "5m",
    icon: "/icons/dvr.svg",
    unread: true,
  },
  {
    id: 2,
    title: "24 supplier has joined",
    subtitle: "Food Service Paper Cups - Q2",
    time: "1h",
    icon: "/icons/group_nots.svg",
    unread: false,
  },
  {
    id: 3,
    title: "Auction ‘Q1 Office Supplies’ has ended",
    time: "2h",
    icon: "/icons/dvr.svg",
    unread: false,
  },
];

export default function NotificationDropdown({ open, onClose }: { open: boolean, onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 z-50 w-96 bg-white rounded-xl border border-border shadow-xl"
      style={{
        boxShadow: '0 8px 24px 0 rgba(16,30,54,0.14)',
      }}
    >
      <div className="px-6 py-3 border-b border-[#F1F1F3] text-base text-black">
        Notification
      </div>
      <div>
        {notifications.map((n, i) => (
          <div
            key={n.id}
            className={[
              "flex items-start gap-3 px-6 py-4 cursor-pointer transition-all",
              i === 0 ? "bg-[#F0F6FF]" : "bg-transparent",
              "hover:bg-[#f5f6fa]",
            ].join(" ")}
            style={{
              borderBottom: i === notifications.length - 1 ? "none" : "1px solid #F1F1F3",
            }}
          >
            <div className="pt-1">
              <Image width={24} height={24} src={n.icon} alt="" className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center gap-4">
                <span className=" text-black truncate">{n.title}</span>
                <span className="text-xs text-[#757575]">{n.time}</span>
              </div>
              {n.subtitle && (
                <div className="text-xs text-[#757575] mt-1">{n.subtitle}</div>
              )}
              {n.link && (
                <a
                  href={n.linkUrl}
                  className="text-xs text-[#2B72FF] mt-1 hover:underline"
                >
                  {n.link}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
