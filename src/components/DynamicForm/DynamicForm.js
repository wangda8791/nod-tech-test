import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  LinearProgress,
  colors,
} from '@material-ui/core';
import FormField from '../FormField';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {},
  actionPanel: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  progress: {
    margin: theme.spacing(0, 1),
    flexGrow: 1
  },
  saveButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

String.prototype.toCamelCase = function() {
  return this
      .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
      .replace(/\s/g, '')
      .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}

const getDataStructure = (fields) => {
  const structure = {};
  for (const field of fields) {
    if (field.type === 'multi-select') {
      structure[field.name.toCamelCase()] = { value: [], valid: false };
    } else {
      structure[field.name.toCamelCase()] = { value: '', valid: false };
    }
  }
  return structure;
};

function DynamicForm({ fields, className, ...rest }) {
  const classes = useStyles();
  const [values, setValues] = useState(getDataStructure(fields));
  const [progress, setProgress] = useState(0);

  const handleChange = (field, value, error) => {
    setValues({
      ...values,
      [field]: { value, valid: !error },
    });
  };

  const getFieldValue = (field) => {
    const value = values[field.name.toCamelCase()].value;
    if (field.type === 'multi-select') {
      return `"${value.join(', ')}"`;
    } else if (field.type === 'date') {
      return moment(value).format('DD/MM/YYYY');
    }
    return value;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const csv = `${fields.map(field => field.name).join(',')}\n${fields.map(field => getFieldValue(field)).join(',')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = Date.now() + '.csv';
    link.click();
  };

  useEffect(() => {
    setValues(getDataStructure(fields));
  }, [fields]);

  useEffect(() => {
    if (!values) return 0;
    let validCount = 0;
    for (let value in values) {
      if (values[value].valid) validCount++;
    }
    setProgress(100 * (validCount / fields.length));
  }, [fields.length, values]);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader title="Profile" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={4}
          >
            {fields.map(field => <FormField
              key={field.name.toCamelCase()}
              field={field}
              value={values[field.name.toCamelCase()].value}
              onChange={handleChange}
            />)}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions className={classes.actionPanel}>
          {progress > 0 && 
          <LinearProgress
            className={classes.progress}
            value={progress}
            variant="determinate"
          />
          }
          <Button
            disabled={progress<100}
            className={classes.saveButton}
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}

DynamicForm.propTypes = {
  className: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default DynamicForm;
