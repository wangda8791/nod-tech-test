import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import fields from './json/fields.json';
const mock = new MockAdapter(axios);

mock.onGet('/fields').reply(200, {
  fields
});

export default axios;