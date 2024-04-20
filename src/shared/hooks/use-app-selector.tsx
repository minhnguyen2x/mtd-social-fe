import { useSelector } from 'react-redux';
import type { StoreState } from '@shared/types/store';

export const useAppSelector = useSelector.withTypes<StoreState>();
