// 인자를 2개로 확장
export const handleNumericInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  callback: (value: number) => void
) => {
  const value = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
  callback(value);
};

export const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/[0-9]/.test(e.key) &&
    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
  ) {
    e.preventDefault();
  }
};
