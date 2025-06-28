'use client';

import { useState } from 'react';

export default function InviteUserModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  return (
    <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05a1 1 0 011.414-1.414L10 8.586z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-body mb-1">Send Invite</h2>
        <p className="text-sm text-gray-500 mb-6">
          Add a user by sending them an invitation to the platform
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-body mb-1">Email</label>
            <input
              type="email"
              placeholder="eg. abhina@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-borderInput px-3 py-2 rounded text-sm text-body"
            />
          </div>

          <div>
            <label className="block text-sm text-body mb-1">Select role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-borderInput px-3 py-2 rounded text-sm text-body bg-white"
            >
              <option value="">Select</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        </div>

        <button
          className="mt-6 w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded text-sm font-semibold"
          onClick={() => {
            // you can later send the form values here
            alert(`Invited ${email} as ${role}`);
            onClose();
          }}
        >
          Send invite
        </button>
      </div>
    </div>
  );
}
