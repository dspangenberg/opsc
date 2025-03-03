import { LucideProps, icons } from 'lucide-react';
import { IconName } from './icon-picker';

interface IconProps extends Omit<LucideProps, 'ref'> {
    name: IconName;
  }

export const Icon = ({ name, ...props }: IconProps) => {
    const LucideIcon = icons[name];
    return <LucideIcon {...props} />;
  };