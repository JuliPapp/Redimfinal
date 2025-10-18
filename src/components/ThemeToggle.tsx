import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

type Props = {
  theme: 'light' | 'dark';
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      title={theme === 'light' ? 'Activar modo nocturno' : 'Activar modo claro'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </Button>
  );
}
