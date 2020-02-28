import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  Tooltip,
  Chip,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import validate from 'validate.js';
import MultiSelect from '../MultiSelect';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
}));

function FormField({ field, value, onChange }) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [chips, setChips] = useState(value);
  const classes = useStyles();
  
  const handleChange = (event) => {
    setTouched(true);
    if (field.type === "date") {
      handleCalendarClose();
      onChange(field.name.toCamelCase(), event, !!error);
    } else {
      event.persist();
      onChange(field.name.toCamelCase(), event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value, !!error);
    }
  }

  const handleCalendarOpen = () => {
    setCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setCalendarOpen(false);
  };

  const handleChipDelete = (chip) => {
    const newChips = chips.filter((item) => chip !== item);
    setChips(newChips);
    onChange(field.name.toCamelCase(), newChips, newChips.length === 0);
  };

  const handleMultiSelectChange = (value) => {
    setChips(value);
    onChange(field.name.toCamelCase(), value, value.length === 0);
  };

  const hasError = () => (!!(touched && error));

  useEffect(() => {
    let schema;
    if (field.type === "short-text" || 
      field.type === "long-text") {
      schema = {
        [field.name.toCamelCase()]: {
          presence: { allowEmpty: false, message: 'is required' },
        }
      }
    } else if (field.type === "email") {
      schema = {
        [field.name.toCamelCase()]: {
          presence: { allowEmpty: false, message: 'is required' },
          email: true,
        }
      }
    } else if (field.type === "phone-number") {
      schema = {
        [field.name.toCamelCase()]: {
          presence: { allowEmpty: false, message: 'is required' },
          format: {
            pattern: /^([+]?[0-9]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4}))?$/g,
            message: function(value, attribute, validatorOptions, attributes, globalOptions) {
              return validate.format("^%{field} is not a valid phone number", {
                field: field.name
              });
            }
          },
        }
      }
    } else if (field.type === "dropdown") {
      schema = {
        [field.name.toCamelCase()]: {
          presence: { allowEmpty: false, message: 'is required' },
        }
      }
    } else if (field.type === "multi-select") {
      schema = {
        [field.name.toCamelCase()]: {
          presence: { allowEmpty: false, message: 'is required' },
        }
      }
    }
    if (schema) {
      const error = validate({
        [field.name.toCamelCase()]: value
      }, schema);
      setError(error);
      onChange(field.name.toCamelCase(), value, !!error);
    }
  }, [field.name, field.type, value]);

  let span = 12;
  let fieldComponent;
  if (field.type === "short-text") {
    span = 6;
    fieldComponent = <TextField
        error={hasError(field.name.toCamelCase())}
        helperText={hasError(field.name.toCamelCase()) ? error[field.name.toCamelCase()] : null}
        fullWidth
        label={field.name}
        name={field.name.toCamelCase()}
        onChange={handleChange}
        required
        value={value}
        variant="outlined"
      />
  } else if (field.type === "long-text") {
    fieldComponent = <TextField
        error={hasError(field.name.toCamelCase())}
        helperText={hasError(field.name.toCamelCase()) ? error[field.name.toCamelCase()] : null}
        fullWidth
        label={field.name}
        name={field.name.toCamelCase()}
        onChange={handleChange}
        required
        value={value}
        variant="outlined"
      />
  } else if (field.type === "email") {
    fieldComponent = <TextField
        error={hasError(field.name.toCamelCase())}
        helperText={hasError(field.name.toCamelCase()) ? error[field.name.toCamelCase()] : null}
        fullWidth
        label={field.name}
        name={field.name.toCamelCase()}
        onChange={handleChange}
        required
        value={value}
        variant="outlined"
      />
  } else if (field.type === "phone-number") {
    fieldComponent = <TextField
        error={hasError(field.name.toCamelCase())}
        helperText={hasError(field.name.toCamelCase()) ? error[field.name.toCamelCase()] : null}
        fullWidth
        label={field.name}
        name={field.name.toCamelCase()}
        onChange={handleChange}
        required
        type="text"
        value={value}
        variant="outlined"
      />
  } else if (field.type === "date") {
    fieldComponent = <>
      <TextField
        error={hasError(field.name.toCamelCase())}
        helperText={hasError(field.name.toCamelCase()) ? error[field.name.toCamelCase()] : null}
        fullWidth
        label={field.name}
        name={field.name.toCamelCase()}
        required
        onClick={handleCalendarOpen}
        value={value ? moment(value).format('DD/MM/YYYY') : ''}
        variant="outlined"
      />
      <DatePicker
        onChange={handleChange}
        onClose={handleCalendarClose}
        open={calendarOpen}
        style={{ display: 'none' }} // Hide the input element
        value={value}
        variant="dialog"
      />
    </>
  } else if (field.type === "dropdown") {
    fieldComponent = <TextField
        error={hasError(field.name.toCamelCase())}
        helperText={hasError(field.name.toCamelCase()) ? error[field.name.toCamelCase()] : null}
        fullWidth
        label={field.name}
        name={field.name.toCamelCase()}
        onChange={handleChange}
        select
        required
        // eslint-disable-next-line react/jsx-sort-props
        SelectProps={{ native: true }}
        value={value}
        variant="outlined"
      >
        <option
            key="$empty$"
            value=""
          >
        </option>
        {field.options.map((state) => (
          <option
            key={state}
            value={state}
          >
            {state}
          </option>
        ))}
      </TextField>
  } else if (field.type === "multi-select") {
    fieldComponent = <>
      <div className={classes.chips}>
        {chips && chips.map(chip => (
          <Chip
            className={classes.chip}
            key={chip}
            label={chip}
            onDelete={() => handleChipDelete(chip)}
          />
        ))}
      </div>
      <div>
        <MultiSelect
          key={field.name.toCamelCase()}
          label={field.name}
          onChange={handleMultiSelectChange}
          options={field.options}
          value={chips}
        />
      </div>
      </>
  } else {
    fieldComponent = <></>
  }

  return <Grid
        item
        md={span}
        xs={12}
      >
      {field.description && 
      <Tooltip title={field.description}>
        {fieldComponent}
      </Tooltip>
      }
      {!field.description && 
        fieldComponent
      }
    </Grid>
};

FormField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func,
};

export default FormField;
