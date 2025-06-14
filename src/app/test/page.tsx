export default function Page() {
  return (
    <div>
      <div className="bg-primary text-white p-4">Primary (should be blue)</div>
      <div className="bg-status-scheduled-light text-status-scheduled-text p-4">
        Status Scheduled Light (should be light blue bg, blue text)
      </div>
    </div>
  );
}
