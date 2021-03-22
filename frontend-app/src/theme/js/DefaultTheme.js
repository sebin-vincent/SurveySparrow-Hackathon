
import { createMuiTheme } from '@material-ui/core';

const Theme = createMuiTheme({
    palette: {
        primary: {
            main: '#46178F',
            contrastText: '#fff'
        },
        secondary: {
            main: '#333',
            contrastText: '#fff'
        },
    },
    typography: {
        htmlFontSize: 10,
        fontSize: 12,
        fontFamily: 'Montserrat, Roboto, sans-serif'
    },
    overrides: {
        MuiButton: {
            root: {
                "font-weight": "600",
                "text-transform": "inherit",
                "letter-spacing": "0.025rem",
            }
        }
    }
});

export default Theme;