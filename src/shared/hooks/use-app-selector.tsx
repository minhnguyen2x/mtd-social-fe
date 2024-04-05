import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { StoreState } from '@shared/types/store';

export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;
