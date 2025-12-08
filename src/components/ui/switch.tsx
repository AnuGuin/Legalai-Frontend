import { Switch } from '@base-ui-components/react/switch';

export default function ExSwitch({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (checked: boolean) => void }) {
  return (
    <Switch.Root 
      checked={checked} 
      onCheckedChange={onCheckedChange} 
      className="w-11 h-6 rounded-full bg-zinc-700 data-[checked]:bg-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
    >
      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform data-[checked]:translate-x-[22px] translate-x-0.5 translate-y-0.5" />
    </Switch.Root>
  );
}
