"use client";
import { createContext, useContext, useState } from 'react';

type Store = Partial<{
  apartments: any;
  pageInfo: Partial<{
    page: number;
    limit: number;
    totalCount: number;
    totalPage: number;
  }>;
}>;


const AppContext = createContext<any>(undefined);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  let [state, setState] = useState({
    apartments: [],
    pageInfo: {
      page: 1,
      limit: 9,
      totalCount: 0,
      totalPage: 1,
    },
  });
  return (
    <AppContext.Provider value={{ state, setState}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
