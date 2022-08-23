import { configureStore } from '@reduxjs/toolkit';

import populationReducer from '../population/populationSlice';

export const store = configureStore({
    reducer: {
        populations: populationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
