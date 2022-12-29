import styled from 'styled-components';

export const DateWrapper = styled.div`
  width: 750px;
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
