import { Mountain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-20 h-20'
};

const textStyles = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl'
};

export const Logo = ({ size = 'md', className, showText = false }: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        <div className={cn(
          'bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-110',
          sizeStyles[size]
        )}>
          <Mountain className={cn(
            'text-white drop-shadow-lg',
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-10 h-10'
          )} />
        </div>
        <div className={cn(
          'absolute -top-1 -right-1 bg-gradient-to-r from-accent to-primary rounded-full animate-pulse shadow-lg',
          size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
        )}>
          <Sparkles className={cn(
            'text-white',
            size === 'sm' ? 'w-2 h-2 m-0.5' : size === 'md' ? 'w-3 h-3 m-0.5' : 'w-4 h-4 m-1'
          )} />
        </div>
      </div>
      
      {showText && (
        <div className="space-y-0.5">
          <h2 className={cn(
            'font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent',
            textStyles[size]
          )}>
            Tesoros del Chocó
          </h2>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground font-medium">
              Artesanías Auténticas
            </p>
          )}
        </div>
      )}
    </div>
  );
};