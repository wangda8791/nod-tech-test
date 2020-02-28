import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FormField from './FormField';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { act } from 'react-dom/test-utils';

const theme = createMuiTheme();

describe('Form Field', () => {
  beforeEach(() => {
    String.prototype.toCamelCase = function() {
      return this
          .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
          .replace(/\s/g, '')
          .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
    }
  });

  test('renders short text field span to half', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <FormField field={{
            "type": "short-text",
            "id": 1,
            "name": "First Name"
          }} value="Hello" onChange={()=>{}} />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
    
    expect(container.querySelectorAll(".MuiGrid-grid-md-6").length).toBe(1);
  });

  test('renders long text field span to half', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <FormField field={{
            "type": "long-text",
            "id": 1,
            "name": "Address"
          }} value="Test Address" onChange={()=>{}} />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
    
    expect(container.querySelectorAll(".MuiGrid-grid-md-6").length).toBe(0);
  });

  test('validate email', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <FormField field={{
            "type": "email",
            "id": 1,
            "name": "Email"
          }} value="wrongemail@sdf.sdf" onChange={()=>{}} />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
    fireEvent.change(container.querySelector(`[name=email]`), { target: { value: 'wrongemail@sdf.co' } });
    setTimeout(() => {
      expect(container.querySelector(".MuiFormHelperText-filled").innerHTML).toBe('Email is not a valid email');
    }, 0);
  });
});