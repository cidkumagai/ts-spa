/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store/store';

type ResPrefList = {
    message: null;
    result: [
        {
            prefCode: number;
            prefName: string;
        }
    ];
};

// 都道府県一覧の取得
export const getPrefList = createAsyncThunk(
    'populations/getPrefList',
    async () => {
        const apiKey = process.env.REACT_APP_APIKEY;
        if (typeof apiKey === 'string') {
            const { data } = await axios.get<ResPrefList>(
                'https://opendata.resas-portal.go.jp/api/v1/prefectures',
                {
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                }
            );
            return data.result;
        }
    }
);

type ResPrefData = {
    message: null;
    result: {
        boundaryYear: number;
        data: [
            {
                label: string;
                data: [
                    {
                        year: number;
                        value: number;
                    }
                ];
            }
        ];
    };
};

// 都道府県別データの取得
export const getPrefData = createAsyncThunk(
    'populations/getPrefData',
    async (id: number) => {
        const apiKey = process.env.REACT_APP_APIKEY;
        if (typeof apiKey === 'string') {
            const { data } = await axios.get<ResPrefData>(
                `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${id}`,
                {
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                }
            );
            return { id: id, res: data.result.data };
        }
    }
);

interface PopulationState {
    result?: [
        {
            prefCode?: number;
            prefName?: string;
            isChecked?: boolean;
            prefData?: number[];
        }
    ];
    period?: number[];
}

const initialState: PopulationState = {
    result: undefined,
    period: undefined,
};

export const populationSlice = createSlice({
    name: 'populations',
    initialState,
    reducers: {
        updatePref: (
            state: PopulationState,
            action: PayloadAction<{ id: number; checked: boolean }>
        ) => {
            if (state.result) {
                state.result[action.payload.id - 1].isChecked =
                    action.payload.checked;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPrefList.fulfilled, (state, action) => {
            state.result = action.payload;
        });
        builder.addCase(getPrefData.fulfilled, (state, action) => {
            if (state.period === undefined && action.payload) {
                state.period = action.payload.res[0].data.map((data) => {
                    return data.year;
                });
            }
            if (state.result && action.payload) {
                state.result[action.payload.id - 1].prefData =
                    action.payload.res[0].data.map((data) => {
                        return data.value;
                    });
            }
        });
    },
});

export const { updatePref } = populationSlice.actions;
export const selectPopulations = (state: RootState) => state.populations;
export default populationSlice.reducer;
