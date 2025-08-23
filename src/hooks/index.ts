import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useForm } from './useForm';
export { useTransactionForm } from './useTransactionForm';
export { useTransaction } from './useTransaction';
export { useSerializableData } from './useSerializableData';
export { useNotifications } from './useNotifications';
