import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api';

const SLICE_NAME = 'heroes';

const getHeroes = createAsyncThunk(
    `${SLICE_NAME}/getHeroes`,
    async (param, thunkAPI) => {
        try {
            const {data: {data: superheroes}} = await API.getHeroes();
            return superheroes;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const initialState = {
    heroes: [],
    isLoading: false,
    error: null 
}

const heroSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getHeroes.pending, (state, action) => {
            state.error = null;
            state.isLoading = true;
        });

        builder.addCase(getHeroes.fulfilled, (state, action) => {
            state.isLoading = false;
            state.heroes = action.payload;
        });

        builder.addCase(getHeroes.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

const { reducer } = heroSlice;

export { getHeroes };

export default reducer;