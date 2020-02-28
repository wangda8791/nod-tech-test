import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import DynamicForm from './components/DynamicForm';
import { createMuiTheme, Container } from '@material-ui/core';
import MomentUtils from '@date-io/moment';

import palette from './theme/palette';
import typography from './theme/typography';
import overrides from './theme/overrides';
import mock from './mock/Service';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const baseTheme = {
  palette,
  typography,
  overrides
};
const theme = createMuiTheme(baseTheme);

function App({initialFields}) {
  const [fields, setFields] = useState(initialFields);
  useEffect(() => {
    const fetchData = async () => {
      let { data: { fields } } = await mock.get('/fields');
      setFields(fields);
    };

    fetchData();
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Container maxWidth="md">
            { fields && 
            <DynamicForm fields={fields} />
            }
            { !fields && <></> }
          </Container>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
