import styled from 'styled-components';

export const DateWrapper = styled.div`
  display: flex;
  width: ${({ expand }) => (expand ? '800px' : '400px')};
  gap: 3rem;
  .compare-date {
    display: flex;
    align-items: flex-end;
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  & > div {
    margin-right: var(--p-space-2);
  }
  .Polaris-Select__SelectedOption {
    font-weight: var(--p-font-weight-semibold);
  }
`;
