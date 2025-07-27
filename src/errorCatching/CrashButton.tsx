import React from 'react';

export const Bomb: React.FC = () => {
  throw new Error('Test Crash');
  return null;
};
