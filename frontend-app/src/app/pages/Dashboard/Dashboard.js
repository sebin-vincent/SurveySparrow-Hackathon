import { Grid } from '@material-ui/core';
import React from 'react';

import PageContainer from '../../components/PageContainer';
import CollectionListing from '../../containers/CollectionListing/CollectionListing';
import KahootListing from '../../containers/KahootListing/KahootListing';

import './Dashboard.scss';

const Dashboard = () => {
    return (
        <PageContainer>
            <Grid container className="dashboard" spacing={2}>
                <Grid item xs={12} sm={7} className="dashboard_collection">
                    <CollectionListing />
                </Grid>
                <Grid item xs={12} sm={5} className="dashboard_collection">
                    <KahootListing />
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default Dashboard;