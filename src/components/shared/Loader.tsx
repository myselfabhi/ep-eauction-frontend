// export default function Loader() {
//   return (
//     <div className="flex items-center justify-center py-8">
//       <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
//         <circle
//           className="opacity-25"
//           cx="12"
//           cy="12"
//           r="10"
//           stroke="currentColor"
//           strokeWidth="4"
//           fill="none"
//         />
//         <path
//           className="opacity-75"
//           fill="currentColor"
//           d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//         />
//       </svg>
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';

export default function Loader() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500); // update every 0.5s for smooth effect
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
        EP Auction{dots}
      </h1>
      <p className="mt-2 text-sm text-gray-500">Please wait, processing your request</p>
    </div>
  );
}