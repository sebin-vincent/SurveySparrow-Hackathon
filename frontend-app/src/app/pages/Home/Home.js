import React from 'react';
import { Box, Grid } from '@material-ui/core';

import OAuth from '../../containers/OAuth/OAuth';
import WSAuth from '../../containers/WSAuth/WSAuth';
import './Home.scss';

const Home = () => {
    return (
        <Box className="home-page__wrapper">
            <Grid container className="home-page__container">
                <Grid item xs={12} md={6}>
                    <OAuth />
                </Grid>
                <Grid item xs={12} md={6}>
                    <WSAuth />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;