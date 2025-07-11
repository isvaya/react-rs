import React from 'react';

export class Bomb extends React.Component {
  render() {
    throw new Error('Test Crash');
    return null;
  }
}
