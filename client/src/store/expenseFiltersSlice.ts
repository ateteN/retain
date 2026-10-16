import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaymentMethod } from '../types';

export interface ExpenseFiltersState {
  search: string;
  category: string; 
  paymentMethod: PaymentMethod | '';
  startDate: string; 
  endDate: string; 
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

const initialState: ExpenseFiltersState = {
  search: '',
  category: '',
  paymentMethod: '',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  pageSize: 10,
};

export const expenseFiltersSlice = createSlice({
  name: 'expenseFilters',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.page = 1;
    },
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod | ''>) => {
      state.paymentMethod = action.payload;
      state.page = 1;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
      state.page = 1;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
      state.page = 1;
    },
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.page = 1;
    },
    setSort: (
      state,
      action: PayloadAction<{ sortBy: 'date' | 'amount'; sortOrder: 'asc' | 'desc' }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 1;
    },
    setSortBy: (state, action: PayloadAction<'date' | 'amount'>) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    resetFilters: () => {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setCategory,
  setPaymentMethod,
  setStartDate,
  setEndDate,
  setDateRange,
  setSort,
  setSortBy,
  setSortOrder,
  setPage,
  setPageSize,
  resetFilters,
} = expenseFiltersSlice.actions;

export default expenseFiltersSlice.reducer;
