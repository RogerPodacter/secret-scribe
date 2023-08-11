import React, { ReactNode } from 'react';

interface CenteredContainerProps {
  children: ReactNode;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 100,
      flexDirection: 'column',
    }}
  >
    {children}
  </div>
);

export default CenteredContainer;
