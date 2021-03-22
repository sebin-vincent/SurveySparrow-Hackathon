import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import AppReducer from './reducer/App.reducer';
import GameReducer from './reducer/Game.reducer';
import LoggerMiddleware from '../middleware/Logger';
import MonitorReducerEnhancer from '../enhancers/MonitorReducer';


const configureAppStore = (preloadedState) => {
    const store = configureStore({
        reducer: {
            AppReducer,
            GameReducer
        },
        middleware: [LoggerMiddleware, ...getDefaultMiddleware()],
        preloadedState,
        enhancers: [MonitorReducerEnhancer]
    });

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept('./reducer/App.reducer', () => store.replaceReducer(AppReducer));
    }

    return store;
};

const Store = configureAppStore();

export default Store;
