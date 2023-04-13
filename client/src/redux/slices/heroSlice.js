import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api';
import CONSTANTS from '../../constants';

const SLICE_NAME = 'heroes';

const getHeroes = createAsyncThunk(
    `${SLICE_NAME}/getHeroes`,
    async (pageNumber = 0, thunkAPI) => {
        try {
            const limit = CONSTANTS.itemsPerPage;
            const offset = pageNumber * limit;
            const {data: {data: superheroes, totalHeroesCount}} = await API.getHeroes(limit, offset);
            
            return {superheroes, totalHeroesCount};
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const initialState = {
    heroes: [],
    isLoading: false,
    error: null,
    totalHeroesCount: 0 
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
            state.heroes = action.payload.superheroes;
            state.totalHeroesCount = action.payload.totalHeroesCount;
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