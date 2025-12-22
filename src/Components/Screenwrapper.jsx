import React from 'react';

const ScreenWrapper = ({ children, className = "", style = {} }) => (
  <div className={`screen-wrapper ${className}`} style={style}>
    <div className={className === 'container-lg' ? 'container-lg' : 'container'}>
      {children}
    </div>
  </div>
);

export default ScreenWrapper;
