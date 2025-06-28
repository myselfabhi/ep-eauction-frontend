'use client';

type Props = {
  steps: string[];
  currentStep: number;
  onStepClick?: (index: number) => void; // Optional for just UI
};

export default function OnboardingBreadcrumb({ steps, currentStep, onStepClick }: Props) {
  return (
    <div className="flex items-center justify-center mb-8 w-full max-w-[450px] mx-auto">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const canClick = !!onStepClick && index <= currentStep;

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
          <div key={index} className="flex items-center">
            <div
              className={style}
              onClick={() => {
                if (canClick && onStepClick) onStepClick(index);
              }}
            >
              {`${index + 1}. ${label}`}
            </div>
            {/* Divider, except after last step */}
            {index < steps.length - 1 && (
              <div className="mx-2 h-0.5 bg-gray-200 flex-1 min-w-[36px] max-w-[56px]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
