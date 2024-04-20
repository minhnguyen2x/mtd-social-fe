import { useStore } from 'react-redux';
import type { AppStore } from '@shared/types/store';

export const useAppStore = useStore.withTypes<AppStore>();
