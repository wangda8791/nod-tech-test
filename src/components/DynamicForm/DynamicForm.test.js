import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import DynamicForm from './DynamicForm';
import fields from '../../mock/json/fields.json';

const theme = createMuiTheme();

describe('Dynamic Form', () => {
  let wrapper = null;

  beforeEach(() => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DynamicForm fields={fields} />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
    wrapper = container;
  })

  test('has number of fields', () => {
    expect(wrapper.querySelectorAll(".MuiGrid-item").length).toBe(fields.length);
  });

  test('has disabled submit button', () => {
    expect(wrapper.querySelectorAll(".Mui-disabled").length).toBe(1);
  });

  test('has progress with valid percentage', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DynamicForm fields={fields} />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
    fireEvent.change(container.querySelector(`[name=firstName]`), { target: { value: 'Wang' } });
    fireEvent.change(container.querySelector(`[name=lastName]`), { target: { value: 'Da' } });
    fireEvent.change(container.querySelector(`[name=email]`), { target: { value: 'wang@domain.com' } });
    fireEvent.change(container.querySelector(`[name=address]`), { target: { value: 'Test Address' } });
    fireEvent.change(container.querySelector(`[name=contactNumber]`), { target: { value: '1234567890' } });
    fireEvent.change(container.querySelector(`[name=gender]`), { target: { value: 'Male' } });
    expect(parseFloat(container.querySelector(".MuiLinearProgress-root").getAttribute('aria-valuenow'))).toBe(100 * (6 / fields.length));
  });
});
