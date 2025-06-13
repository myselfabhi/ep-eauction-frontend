'use client';

type AuctionBreadcrumbProps = {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;  // NEW
};

export default function AuctionBreadcrumb({ steps, currentStep, onStepClick }: AuctionBreadcrumbProps) {
  return (
    <div className="flex gap-3 mb-6">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        let style =
          'px-4 py-1 rounded-full text-sm border border-gray-300 text-gray-600 bg-white cursor-pointer';
        if (isActive) {
          style = 'px-4 py-1 rounded-full text-sm border border-blue-600 text-blue-600 bg-blue-50 font-medium cursor-pointer';
        } else if (isCompleted) {
          style = 'px-4 py-1 rounded-full text-sm border border-green-600 text-green-600 bg-green-50 font-medium cursor-pointer';
        }

        return (
          <div
            key={index}
            className={style}
            onClick={() => onStepClick(index)}   // This enables click
          >
            {`${index + 1}. ${label}`}
          </div>
        );
      })}
    </div>
  );
}
