import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from "./userSlice"
import locationSlice from "./LocationSlice"
// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'] 
};

const rootReducer = combineReducers({
    user: userSlice,
    location:locationSlice
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// store.subscribe(() => {
//     // console.log('Redux state changed:', store.getState());
// });

export const persistor = persistStore(store);
export default store;