import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, UseFormOptions } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Select,
  Textarea,
  Input,
  Button,
  SimpleGrid,
  Text,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  InputRightAddon,
  RadioGroup,
  Stack,
  Flex,
  Radio,
  CheckboxGroup,
  Checkbox,
} from '@chakra-ui/react';
import { ObjectSchema } from 'yup';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

import Icon from '../Icon';
import { capitalize } from '../../helpers';

interface Field {
  name: string;
  type: string;
  placeholder?: string;
  label?: string;
  defaultValue?: string | number | string[] | number[];
  options?: any[];
  left?: string;
  right?: string;
  min?: number;
  max?: number;
  fields?: Field[];
}

interface FormProps {
  settings?: UseFormOptions;
  schema: ObjectSchema;
  onSubmit: (any) => void;
  fields: (Field | Field[])[];
  submit?:
    | ((isDisabled: boolean, isSubmitting: boolean) => React.ReactNode)
    | string;
  isBreathable?: boolean;
}

const SIZE = 'lg';
const VARIANT = 'filled';

const createInput = ({ options, left, right, ...input }, register, control) => {
  let elem;

  if (input.type === 'select') {
    elem = (
      <Select {...input} variant={VARIANT} size={SIZE} ref={register}>
        {options.map((option) => {
          if (typeof option === 'string') {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          } else {
            return (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            );
          }
        })}
      </Select>
    );
  } else if (input.type === 'textarea') {
    elem = <Textarea {...input} variant={VARIANT} size={SIZE} ref={register} />;
  } else if (input.type === 'array') {
    elem = <FieldArray {...input} control={control} register={register} />;
  } else if (input.type === 'read-only') {
    elem = <Text color="gray.700">{input.defaultValue}</Text>;
  } else if (input.type === 'radio' || input.type === 'checkbox') {
    const Group = input.type === 'radio' ? RadioGroup : CheckboxGroup;
    const InputItem = input.type === 'radio' ? Radio : Checkbox;

    elem = (
      <Group {...input}>
        <Stack spacing={2} direction="column">
          {options.map((option) => {
            if (typeof option === 'string') {
              return (
                // @ts-ignore
                <InputItem
                  key={option}
                  value={option}
                  name={input.name}
                  id={`option-${option.toLowerCase().split(' ').join('-')}`}
                  ref={register}
                >
                  {option}
                </InputItem>
              );
            } else {
              return (
                // @ts-ignore
                <InputItem
                  key={option.label}
                  value={option.value}
                  name={input.name}
                  id={`option-${option.value
                    .toLowerCase()
                    .split(' ')
                    .join('-')}`}
                  ref={register}
                >
                  {option.label}
                </InputItem>
              );
            }
          })}
        </Stack>
      </Group>
    );
  } else {
    elem = <Input {...input} variant={VARIANT} size={SIZE} ref={register} />;
  }

  if (!left && !right) return elem;

  return (
    <InputGroup size={SIZE}>
      {left && <InputLeftAddon bg="gray.300" children={left} />}
      {elem}
      {right && <InputRightAddon bg="gray.300" children={right} />}
    </InputGroup>
  );
};

const FieldArray = ({
  name,
  max,
  fields,
  control,
  register,
  defaultValue,
}: any) => {
  const fieldArray = useFieldArray({
    control,
    name,
  });

  const [canAppend, setCanAppend] = useState(true);

  useEffect(() => {
    if (fieldArray.fields.length >= max) setCanAppend(false);
    else setCanAppend(true);
  }, [fieldArray.fields, max]);

  return (
    <>
      {fieldArray.fields.map((item, index) => (
        <Box key={item.id}>
          {fields.map((input) => {
            const inputName = `${name}[${index}].${input.name}`;

            return (
              <InputGroup key={inputName} size={SIZE} mb={2}>
                {createInput(
                  { ...input, name: inputName, defaultValue: item.value },
                  register,
                  control
                )}
                <InputRightElement cursor="pointer">
                  <Icon
                    icon={faTrash}
                    color="red.500"
                    onClick={() => fieldArray.remove(index)}
                  />
                </InputRightElement>
              </InputGroup>
            );
          })}
        </Box>
      ))}
      <Button
        onClick={fieldArray.append}
        disabled={!canAppend}
        colorScheme="blue"
        mt={2}
      >
        <Icon icon={faPlus} mr={2} />
        <Text>Add</Text>
      </Button>
    </>
  );
};

export default ({
  settings = {},
  schema,
  onSubmit,
  fields,
  submit = 'Submit',
  isBreathable,
  ...props
}: FormProps) => {
  const spacing = isBreathable ? 8 : 4;

  const defVals = {};

  fields.forEach(({ name, defaultValue }: Field) => {
    defVals[name] = defaultValue;
  });

  const {
    register,
    control,
    handleSubmit,
    errors,
    formState: { isDirty, isValid, isSubmitting },
  } = useForm({
    ...settings,
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: defVals,
  });

  const composeInput = (input, isFirst) => {
    const hasErrors = Object.prototype.hasOwnProperty.call(errors, input.name);
    const { label, helper } = input;

    return (
      <FormControl
        key={input.name}
        isInvalid={hasErrors}
        mt={isFirst ? 0 : spacing}
      >
        <Flex align="center" wrap="wrap" mb={2}>
          {label && (
            <FormLabel
              mb={0}
              mr={6}
              htmlFor={input.name}
              opacity={label === 'BLANK' ? 0 : 1}
              display={label === 'BLANK' ? ['none', 'block'] : 'block'}
            >
              {label}
            </FormLabel>
          )}
          {helper && helper({ fontSize: 'sm' })}
        </Flex>
        {createInput(input, register, control)}
        {hasErrors && (
          <FormErrorMessage>
            {capitalize(errors[input.name].message.split('_').join(' '))}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  };

  return (
    <Box {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, i) => {
          const isFirst = i === 0;

          if (Array.isArray(field)) {
            // Add labels to subfields that don't have it
            field = field.map((f) => {
              // If we have a null field (a "spacer")
              if (!f) return null;

              return {
                ...f,
                label: f.label || 'BLANK',
              };
            });

            return (
              <SimpleGrid
                key={i}
                columns={[1, field.length]}
                spacing={[0, spacing]}
                mt={isFirst ? -spacing : 0}
              >
                {field.map((subfield) => {
                  // If we have a null field (a "spacer")
                  if (!subfield) return null;

                  return composeInput(subfield, false);
                })}
              </SimpleGrid>
            );
          } else {
            return composeInput(field, isFirst);
          }
        })}
        {typeof submit === 'string' && (
          <Button
            mt={spacing}
            colorScheme="blue"
            disabled={!isDirty || (isDirty && !isValid)}
            isLoading={isSubmitting}
            type="submit"
          >
            {submit}
          </Button>
        )}
        {typeof submit !== 'string' &&
          submit(!isDirty || (isDirty && !isValid), isSubmitting)}
      </form>
    </Box>
  );
};
