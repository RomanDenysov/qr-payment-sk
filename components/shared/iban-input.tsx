'use client';

import { Input } from '@/components/ui/input';
import {
  type ChangeEvent,
  type ChangeEventHandler,
  type FunctionComponent,
  forwardRef,
} from 'react';
import {
  NumberFormatBase,
  type NumberFormatBaseProps,
} from 'react-number-format';

const KEYDOWN_REGEX =
  /^(?:[a-z0-9]|Backspace|Delete|Home|End|ArrowLeft|ArrowRight|Shift|CapsLock|Control|NumLock|Tab|Paste|Redo|Undo)$/i;
const CHAR_REGEX = /^[a-z0-9]$/i;

interface IBANInputProps extends NumberFormatBaseProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const ibanFormatter = (value: string) =>
  value
    .replace(/\s+/g, '')
    .replace(/([a-z0-9]{4})/gi, '$1 ')
    .trim()
    .toLocaleUpperCase();

const removeFormatter = (value: string) => value.replace(/\s+/gi, '');
const characterValidator = (char: string) => CHAR_REGEX.test(char);
const getCaretBoundary = (value: string) =>
  // biome-ignore lint/style/useConsistentBuiltinInstantiation: <explanation>
  Array(value.length + 1)
    .fill(0)
    .map((_v) => true);

const IBANInputDef: FunctionComponent<IBANInputProps> = ({
  onChange,
  ...props
}) => (
  <NumberFormatBase
    {...props}
    type="text"
    customInput={Input}
    format={ibanFormatter}
    removeFormatting={removeFormatter}
    isValidInputCharacter={characterValidator}
    getCaretBoundary={getCaretBoundary}
    onValueChange={(values, { event }) =>
      onChange?.(
        Object.assign({} as ChangeEvent<HTMLInputElement>, event, {
          target: { name: props.name, value: values.value.toUpperCase() },
        })
      )
    }
    onKeyDown={(e) => !KEYDOWN_REGEX.test(e.key) && e.preventDefault()}
  />
);

export const IBANInput = forwardRef<HTMLInputElement, IBANInputProps>(
  (props, ref) => <IBANInputDef {...props} getInputRef={ref} />
);

IBANInput.displayName = 'IBANInput';
