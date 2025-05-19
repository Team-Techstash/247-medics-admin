import React from 'react';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(239, 66, 168, 0.1);
  border-left-color: var(--theme-deafult);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
`;

const ProgressSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(239, 66, 168, 0.1);
  border-left-color: var(--theme-deafult);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ProgressComponent = () => (
  <ProgressWrapper>
    <ProgressSpinner />
  </ProgressWrapper>
);

const Loader = () => {
  return (
    <LoaderWrapper>
      <Spinner />
    </LoaderWrapper>
  );
};

export default Loader; 