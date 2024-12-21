'use client';

import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange:(value:string)=>void;
}
function CheckboxItem({ label, checked, onChange }: CheckboxProps) {
  return (
    <div className='flex items-center space-x-2'>
      <Checkbox
        id={label.toLowerCase()}
        defaultChecked={checked}
        onCheckedChange={() => onChange(label)}
      />
      <label
        htmlFor='terms'
        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {label}
      </label>
    </div>
  );
}

export default CheckboxItem
