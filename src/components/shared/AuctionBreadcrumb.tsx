'use client';

type AuctionBreadcrumbProps = {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
};

export default function AuctionBreadcrumb({ steps, currentStep, onStepClick }: AuctionBreadcrumbProps) {
  return (
    <div className="flex gap-3 mb-6">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const canClick = index <= currentStep; // Only go back or to current

        let style =
          'px-4 py-1 rounded-full text-sm border border-borderInput text-body bg-white ' +
          (canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-60');
        if (isActive) {
          style =
            'px-4 py-1 rounded-full text-sm border border-status-scheduled text-status-scheduled bg-background-blue font-medium ' +
            (canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-60');
        } else if (isCompleted) {
          style =
            'px-4 py-1 rounded-full text-sm border border-status-success text-status-success bg-status-success-light font-medium ' +
            (canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-60');
        }

        return (
          <div
            key={index}
            className={style}
            onClick={() => {
              if (canClick) onStepClick(index);
            }}
          >
            {`${index + 1}. ${label}`}
          </div>
        );
      })}
    </div>
  );
}
