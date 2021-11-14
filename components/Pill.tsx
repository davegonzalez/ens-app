import styled from 'styled-components';

export const Pill = styled.button<{ selected?: boolean }>`
  width: auto;
  padding: 14px;
  height: 31px;
  background-color: ${({ selected }) => (selected ? '#000' : '#EEEEEE')};
  border-radius: 10px;
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
`;
