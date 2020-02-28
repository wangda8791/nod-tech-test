import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import fields from './mock/json/fields.json';

test('renders form title', () => {
  const { container } = render(<App initialFields={fields} />);
  expect(container.querySelectorAll('form').length).toBe(1);
});
