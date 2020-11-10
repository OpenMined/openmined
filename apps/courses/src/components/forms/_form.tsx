import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, UseFormOptions } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Flex,
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
  Icon,
} from '@chakra-ui/core';
import { ObjectSchema } from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

import { capitalize } from '../../helpers';

interface Field {
  name: string;
  type: string;
  placeholder?: string;
  label?: string;
  defaultValue?: string | number | string[] | number[];
  options?: (string | number)[];
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
}

const SIZE = 'lg';
const VARIANT = 'filled';
const SPACING = 4;

const createInput = ({ options, left, right, ...input }, register, control) => {
  let elem;

  if (input.type === 'select') {
    elem = (
      <Select {...input} variant={VARIANT} size={SIZE} ref={register}>
        {options.map((option) => (
          <option {...option} />
        ))}
      </Select>
    );
  } else if (input.type === 'textarea') {
    elem = <Textarea {...input} variant={VARIANT} size={SIZE} ref={register} />;
  } else if (input.type === 'array') {
    // TODO: Not sure why this is going wrong, should fix it
    // @ts-ignore
    elem = <FieldArray {...input} control={control} register={register} />;
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
  ...props
}) => {
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
                  {/* TODO: Icons are kinda ugly like this, do something about it when we import OMUI to the monorepo */}
                  <Icon
                    as={FontAwesomeIcon}
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
        {/* TODO: Icons are kinda ugly like this, do something about it when we import OMUI to the monorepo */}
        <Icon as={FontAwesomeIcon} icon={faPlus} mr={2} />
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
}: FormProps) => {
  const defVals = {};

  // TODO: Not sure why this is going wrong, should fix it
  // @ts-ignore
  fields.forEach(({ name, defaultValue }) => {
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
    const { label } = input;

    return (
      <FormControl
        key={input.name}
        isInvalid={hasErrors}
        mt={isFirst ? 0 : SPACING}
      >
        {label && (
          <FormLabel
            htmlFor={input.name}
            opacity={label === 'BLANK' ? 0 : 1}
            display={label === 'BLANK' ? ['none', 'block'] : 'block'}
          >
            {label}
          </FormLabel>
        )}
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
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, i) => {
        const isFirst = i === 0;

        if (Array.isArray(field)) {
          // Add labels to subfields that don't have it
          field = field.map((f) => ({
            ...f,
            label: f.label || 'BLANK',
          }));

          return (
            <SimpleGrid
              key={i}
              columns={[1, field.length]}
              spacing={[0, SPACING]}
              mt={isFirst ? -SPACING : 0}
            >
              {field.map((subfield) => composeInput(subfield, false))}
            </SimpleGrid>
          );
        } else {
          return composeInput(field, isFirst);
        }
      })}
      {typeof submit === 'string' && (
        <Button
          mt={SPACING}
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
  );
};
