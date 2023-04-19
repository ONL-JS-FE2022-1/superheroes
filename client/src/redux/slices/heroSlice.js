import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../../api';
import CONSTANTS from '../../constants';

const SLICE_NAME = 'heroes';

const getHeroes = createAsyncThunk(
    `${SLICE_NAME}/getHeroes`,
    async (pageNumber = 0, thunkAPI) => {
        try {
            const limit = CONSTANTS.itemsPerPage;
            const offset = pageNumber * limit;
            const { data: { data: superheroes, totalHeroesCount } } = await API.getHeroes(limit, offset);

            const lastPageNumber = Math.ceil(totalHeroesCount / CONSTANTS.itemsPerPage);

            return { superheroes, totalHeroesCount, lastPageNumber };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const deleteHero = createAsyncThunk(
    `${SLICE_NAME}/deleteHero`,
    async (heroId, thunkAPI) => {
        try {
            await API.deleteHero(heroId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const deletePower = createAsyncThunk(
    `${SLICE_NAME}/deletePower`,
    async ({ heroId, powerId }, thunkAPI) => {
        try {
            await API.deletePower(heroId, powerId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const addPower = createAsyncThunk(
    `${SLICE_NAME}/addPower`,
    async ({ heroId, powerName }, thunkAPI) => {
        try {
            await API.addPower(heroId, powerName);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const editHero = createAsyncThunk(
    `${SLICE_NAME}/editHero`,
    async ({ heroId, values }, thunkAPI) => {
        try {
            await API.editHero(heroId, values);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const deleteImage = createAsyncThunk(
    `${SLICE_NAME}/deleteImage`,
    async ({ heroId, imageId }, thunkAPI) => {
        try {
            await API.deleteImage(heroId, imageId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const addImage = createAsyncThunk(
    `${SLICE_NAME}/addImage`,
    async ({ heroId, formData }, thunkAPI) => {
        console.log([...formData.entries()]);
        try {
            await fetch(`http://localhost:5000/api/superheroes/${heroId}/images`, {
                method: 'POST',
                body: formData
            })
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const addHero = createAsyncThunk(
    `${SLICE_NAME}/addHero`,
    async(hero, thunkAPI) => {
        try {
            await API.addHero(hero);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const createRandomHero = createAsyncThunk(
    `${SLICE_NAME}/createRandomHero`,
    async(params, thunkAPI) => {
        try {
            await API.createRandomHero();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const initialState = {
    heroes: [],
    isLoading: false,
    error: null,
    totalHeroesCount: 0,
    lastPageNumber: 0
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
            state.lastPageNumber = action.payload.lastPageNumber;
        });
        builder.addCase(getHeroes.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(deleteHero.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteHero.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteHero.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(deletePower.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deletePower.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deletePower.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(addPower.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addPower.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(addPower.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(editHero.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editHero.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editHero.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(deleteImage.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteImage.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteImage.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(addImage.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addImage.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(addImage.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(addHero.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addHero.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(addHero.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(createRandomHero.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createRandomHero.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createRandomHero.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
})

const { reducer } = heroSlice;

export { getHeroes, deleteHero, deletePower, addPower, editHero, deleteImage, addImage, addHero, createRandomHero };

export default reducer;