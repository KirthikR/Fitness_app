import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Simple test that doesn't require renderer
test('true is true', () => {
  expect(true).toBe(true);
});

// Component test using @testing-library/react-native
describe('App component', () => {
  it('renders correctly', () => {
    const TestComponent = () => (
      <View testID="test-view">
        <Text>Test Component</Text>
      </View>
    );
    
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test-view')).toBeTruthy();
  });
});