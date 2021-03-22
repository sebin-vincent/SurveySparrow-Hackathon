import React from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';

import Routes from './Routes';
import Store from '../redux/ConfigureStore';
import Theme from '../theme/js/DefaultTheme';
import '../theme/scss/styles.scss';

const App = () => {
    return (
        <Provider store={Store}>
            <ThemeProvider theme={Theme}>
                <SnackbarProvider maxSnack={3}>
                    <Routes />
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;