import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HomeScreen } from './HomeScreen';

type Props = {
  mode: 'personal' | 'community';
  userName: string;
  accessToken?: string;
  theme?: 'light' | 'dark';
  onStartCheckIn: () => void;
  onViewHistory?: () => void;
  onViewResources?: () => void;
  onLogout: () => void;
  onModeChange?: (newMode: 'personal' | 'community') => void;
  onThemeToggle?: () => void;
};

export function HomeScreenWithDnd(props: Props) {
  return (
    <DndProvider backend={HTML5Backend}>
      <HomeScreen {...props} />
    </DndProvider>
  );
}
