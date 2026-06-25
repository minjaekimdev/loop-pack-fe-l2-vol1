import { useModal } from '../../shared/ui/modal/useModal';
import { SectionContainer } from '../ui/container';

export const Terms = ({
  agreed,
  onToggleCheckbox,
}: {
  agreed: boolean;
  onToggleCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { open } = useModal();
  return (
    <SectionContainer>
      <label>
        <input type="checkbox" checked={agreed} onChange={onToggleCheckbox} />
        주문 내용 및 약관에 동의합니다
      </label>
      <button className="link" onClick={open}>
        약관 보기
      </button>
    </SectionContainer>
  );
};
