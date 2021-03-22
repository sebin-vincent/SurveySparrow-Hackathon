const round = number => Math.round(number * 100) / 100;

const monitorReducerEnhancer = createStore => (
    reducer,
    initialState,
    enhancer
) => {
    const monitoredReducer = (state, action) => {
        const newState = reducer(state, action)
        const start = performance.now();;
        const end = performance.now();
        const diff = round(end - start);

        // console.log(`Reducer Process Time : ${diff} sec`);

        return newState;
    }

    return createStore(monitoredReducer, initialState, enhancer);
}

export default monitorReducerEnhancer;