// types.ts

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'select'
  | 'date'
  | 'checkbox-group';

export type SelectionType = 'single' | 'multi';

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  value: any;
  error: string;
  helperText?: string;
  options?: FieldOption[];
  selectionType?: SelectionType;
  conditional?: (values: FormValues) => boolean;
  validate?: (value: any, values: FormValues) => string;
}

export type FormValues = { [key: string]: any };
export type FormErrors = { [key: string]: string };



==============================


// hooks/useDynamicForm.ts
import { useMemo, useState } from 'react';
import { Field, FormValues, FormErrors } from '../types';

const useDynamicForm = (initialFields: Field[]) => {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [submitted, setSubmitted] = useState(false);

  const values: FormValues = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, f.value])),
    [fields]
  );

  const errors: FormErrors = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, f.error])),
    [fields]
  );

  const isValid = useMemo(() => fields.every((f) => !f.error), [fields]);

  const updateField = (name: string, value: any) => {
    const updatedFields = fields.map((field) => {
      if (field.name === name) {
        const error = field.validate ? field.validate(value, values) : '';
        return { ...field, value, error };
      }

      if (field.conditional || field.validate) {
        const error = field.validate
          ? field.validate(field.value, { ...values, [name]: value })
          : '';
        return { ...field, error };
      }

      return field;
    });

    setFields(updatedFields);
  };

  const submit = () => {
    const validated = fields.map((field) => {
      const error = field.validate
        ? field.validate(field.value, values)
        : '';
      return { ...field, error };
    });

    setFields(validated);
    setSubmitted(true);

    return {
      values,
      isValid: validated.every((f) => !f.error),
      errors: Object.fromEntries(validated.map((f) => [f.name, f.error])),
    };
  };

  return {
    fields,
    values,
    errors,
    isValid,
    submitted,
    updateField,
    submit,
  };
};

export default useDynamicForm;



===============================

// components/DynamicForm.tsx
import React from 'react';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Field, FormValues } from '../types';

interface Props {
  fields: Field[];
  values: FormValues;
  onFieldChange: (name: string, value: any) => void;
}

const DynamicForm: React.FC<Props> = ({ fields, values, onFieldChange }) => {
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {fields.map((field, index) => {
        if (field.conditional && !field.conditional(values)) return null;

        const commonProps = {
          key: index,
          fullWidth: true,
          variant: 'outlined' as const,
          label: field.label,
          name: field.name,
          error: !!field.error,
          helperText: field.error || field.helperText,
        };

        switch (field.type) {
          case 'select':
            return (
              <FormControl key={index} fullWidth error={!!field.error}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={field.value}
                  label={field.label}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                >
                  {field.options?.map((opt, i) => (
                    <MenuItem key={i} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{field.error || field.helperText}</FormHelperText>
              </FormControl>
            );

          case 'date':
            return (
              <DatePicker
                key={index}
                label={field.label}
                value={field.value}
                onChange={(newValue) => onFieldChange(field.name, newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!field.error,
                    helperText: field.error || field.helperText,
                  },
                }}
              />
            );

          case 'checkbox-group': {
            const isMulti = field.selectionType === 'multi';
            const value = field.value ?? (isMulti ? [] : '');

            const handleChange = (optionValue: string) => {
              let newValue;
              if (isMulti) {
                newValue = value.includes(optionValue)
                  ? value.filter((v: string) => v !== optionValue)
                  : [...value, optionValue];
              } else {
                newValue = value === optionValue ? '' : optionValue;
              }
              onFieldChange(field.name, newValue);
            };

            return (
              <FormControl key={index} error={!!field.error}>
                <Typography variant="subtitle1">{field.label}</Typography>
                {isMulti ? (
                  <FormGroup row>
                    {field.options?.map((opt, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={value.includes(opt.value)}
                            onChange={() => handleChange(opt.value)}
                          />
                        }
                        label={opt.label}
                      />
                    ))}
                  </FormGroup>
                ) : (
                  <RadioGroup
                    row
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                  >
                    {field.options?.map((opt, i) => (
                      <FormControlLabel
                        key={i}
                        value={opt.value}
                        control={<Radio />}
                        label={opt.label}
                      />
                    ))}
                  </RadioGroup>
                )}
                <FormHelperText>{field.error || field.helperText}</FormHelperText>
              </FormControl>
            );
          }

          default:
            return (
              <TextField
                {...commonProps}
                type={field.type}
                value={field.value}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
              />
            );
        }
      })}
    </Box>
  );
};

export default DynamicForm;


====================

// App.tsx
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DynamicForm from './components/DynamicForm';
import useDynamicForm from './hooks/useDynamicForm';
import { Field } from './types';
import { Button, Typography } from '@mui/material';

const formSchema: Field[] = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    value: '',
    error: '',
    validate: (v) => (v ? '' : 'Full name is required'),
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    value: '',
    error: '',
    validate: (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Invalid email'),
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    value: '',
    error: '',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ],
    validate: (v) => (v ? '' : 'Please select gender'),
  },
  {
    name: 'otherGenderExplain',
    label: 'Please explain your gender',
    type: 'text',
    value: '',
    error: '',
    conditional: (values) => values.gender === 'other',
    validate: (v, values) =>
      values.gender === 'other' && !v ? 'Explanation required' : '',
  },
  {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date',
    value: null,
    error: '',
    validate: (v) => (v ? '' : 'Date of birth is required'),
  },
  {
    name: 'hobbies',
    label: 'Select Hobbies',
    type: 'checkbox-group',
    selectionType: 'multi',
    value: [],
    error: '',
    options: [
      { label: 'Music', value: 'music' },
      { label: 'Reading', value: 'reading' },
      { label: 'Sports', value: 'sports' },
      { label: 'Other', value: 'other' },
    ],
    validate: (v) => (v.length > 0 ? '' : 'Select at least one hobby'),
  },
  {
    name: 'otherHobbyExplain',
    label: 'Please explain other hobby',
    type: 'text',
    value: '',
    error: '',
    conditional: (values) =>
      Array.isArray(values.hobbies)
        ? values.hobbies.includes('other')
        : values.hobbies === 'other',
    validate: (v, values) =>
      ((Array.isArray(values.hobbies) &&
        values.hobbies.includes('other')) ||
        values.hobbies === 'other') && !v
        ? 'Please explain'
        : '',
  },
];

const App = () => {
  const { fields, values, updateField, submit, isValid, submitted } =
    useDynamicForm(formSchema);

  const handleSubmit = () => {
    const result = submit();
    if (result.isValid) {
      console.log('✅ Submitted:', result.values);
      alert('Submitted successfully!');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h4" gutterBottom>
        Dynamic Form with TypeScript
      </Typography>
      <DynamicForm
        fields={fields}
        values={values}
        onFieldChange={updateField}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {submitted && !isValid && (
        <Typography color="error" sx={{ mt: 2 }}>
          Please fix errors to continue.
        </Typography>
      )}
    </LocalizationProvider>
  );
};

export default App;


src/
├── types.ts
├── hooks/
│   └── useDynamicForm.ts
├── components/
│   └── DynamicForm.tsx
└── App.tsx
