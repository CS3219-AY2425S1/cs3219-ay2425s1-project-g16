'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type ComboboxMultiProps = {
  options: Array<Option>;
  placeholderText: string;
  noOptionsText: string;
  setValuesCallback?: (values: Array<string>) => void;
};

export const ComboboxMulti = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & ComboboxMultiProps
>(({ className, options, placeholderText, noOptionsText, setValuesCallback, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<Array<string>>([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedValues.length ? (
            <span>
              {selectedValues.length} option{selectedValues.length > 1 && 's'} selected
            </span>
          ) : (
            placeholderText
          )}
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        className={cn('w-[200px] p-0 border-secondary-foreground/40', className)}
        {...props}
      >
        <Command>
          <CommandInput placeholder={placeholderText} />
          <CommandList className=''>
            <CommandEmpty>{noOptionsText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className='hover:cursor-pointer'
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setSelectedValues((values) => {
                      const finalState = values.includes(currentValue)
                        ? values.filter((v) => v !== currentValue)
                        : [...values, currentValue];

                      if (setValuesCallback) {
                        setValuesCallback(finalState);
                      }

                      return finalState;
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

type ComboboxExternalProps = {
  options: Array<{
    value: string;
    label: string;
  }>;
  itemName: string;
  chosenOptions: Array<string>;
  setChosenOptions: (values: Array<string>) => void;
};

export const ComboboxExternal = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & ComboboxExternalProps
>(({ className, itemName, options, chosenOptions, setChosenOptions, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputVal, setInputVal] = React.useState('');

  const onAddNewOption = (newOpt?: string) => {
    const toAdd = newOpt ?? inputVal;
    const opt = toAdd.replace(/^[a-zA-Z]/, (c) => c.toUpperCase());

    if (!chosenOptions.includes(opt)) {
      setChosenOptions([...chosenOptions, opt]);
    }

    setInputVal('');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={isOpen}
          className='w-[200px] justify-between'
        >
          <span>Select {itemName}...</span>
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent ref={ref} {...props} className={cn('w-[200px] p-0', className)}>
        <Command>
          <CommandInput
            value={inputVal}
            onValueChange={setInputVal}
            placeholder={`Search or add ${itemName}...`}
            className='h-9'
          />
          <CommandList>
            <CommandEmpty
              autoFocus
              className='hover:bg-secondary hover:text-secondary-foreground p-3 text-sm hover:cursor-pointer'
              onClick={() => onAddNewOption()}
            >
              Add {`"${inputVal}"`}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className='hover:cursor-pointer'
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    if (chosenOptions.includes(currentValue)) {
                      setChosenOptions(chosenOptions.filter((v) => v !== currentValue));
                    } else {
                      setChosenOptions([...chosenOptions, currentValue]);
                    }

                    setIsOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      chosenOptions.includes(option.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
