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

        let style =
          'px-4 py-1 rounded-full text-sm border border-borderInput text-body bg-white cursor-pointer';
        if (isActive) {
          style =
            'px-4 py-1 rounded-full text-sm border border-status-scheduled text-status-scheduled bg-background-blue font-medium cursor-pointer';
        } else if (isCompleted) {
          style =
            'px-4 py-1 rounded-full text-sm border border-status-success text-status-success bg-status-success-light font-medium cursor-pointer';
        }

        return (
          <div
            key={index}
            className={style}
            onClick={() => onStepClick(index)}
          >
            {`${index + 1}. ${label}`}
          </div>
        );
      })}
    </div>
  );
}
