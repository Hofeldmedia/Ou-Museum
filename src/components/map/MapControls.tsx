import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';

type MapControlsProps = {
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled: boolean;
  nextDisabled: boolean;
};

export function MapControls({ onPrevious, onNext, previousDisabled, nextDisabled }: MapControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <PrimaryButton variant="secondary" disabled={previousDisabled} onClick={onPrevious}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
      </PrimaryButton>
      <PrimaryButton variant="secondary" disabled={nextDisabled} onClick={onNext}>
        Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </PrimaryButton>
    </div>
  );
}
