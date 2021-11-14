import styled from 'styled-components';
import Image from 'next/image';
import MagnifyingGlass from 'styles/magnifying-glass.svg';
import { HTMLInputTypeAttribute, HTMLProps, InputHTMLAttributes } from 'react';

export const Input = styled.input`
  width: 100%;
  border-radius: 10px;
  height: 120px;
  border: 4px solid #d8d8d8;
  font-size: 64px;
  font-weight: 400;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;

  ::placeholder {
    color: #ebebeb;
    opacity: 1; /* Firefox */
  }

  .left-icon {
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    svg {
      fill: black;
      transition: 0.3s;
    }
  }
`;

const Icon = styled.div`
  position: absolute;
  top: 30px;
  left: 28px;
`;

const Container = styled.div`
  position: relative;
`;

const StyledSearchbar = styled(Input)`
  padding-left: 110px;
`;

export const Searchbar: React.FC<InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <Container>
      <StyledSearchbar {...props} />

      <Icon>
        <Image
          className="left-icon"
          src={MagnifyingGlass}
          alt="search icon"
          width="64px"
          height="64px"
        />
      </Icon>
    </Container>
  );
};
