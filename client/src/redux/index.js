import { configureStore } from "@reduxjs/toolkit";
import heroesReducer from './slices/heroSlice'

const store = configureStore({
    reducer: {
        heroes: heroesReducer
    }
})

export default store;