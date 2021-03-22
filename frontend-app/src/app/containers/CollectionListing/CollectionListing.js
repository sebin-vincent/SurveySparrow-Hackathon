import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import Card from '../../components/Card/index';
import { getAllCollections } from '../../../api/service/Collection.service';
import { formatDate } from '../../../config/Utils';

import './CollectionListing.scss';

const CollectionListing = () => {
    const [collections, setCollections] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        getCollections.current();
    }, []);

    const getCollections = useRef(() => { });
    getCollections.current = () => {
        getAllCollections()
            .then(response => {
                setCollections(response);
            })
            .catch(error => {
                enqueueSnackbar(JSON.stringify(error), { variant: 'error' });
            });
    };

    return (
        <Paper className="collection_listing">
            <Typography variant="h6" component="h6" className="collection_listing_title">Collections</Typography>
            <Box className="collection_listing_cards">
                {
                    (collections && collections.length > 0) ?
                        collections.map(collection =>
                            <div className="collection_listing_cards_each" key={collection.id}>
                                <Card
                                    title={collection.title}
                                    subTitle={`Created by ${collection.createdByName} on ${formatDate(collection.createdOn, "LL")}`}
                                />
                            </div>
                        ) :
                        <Typography variant="subtitle1">No collections found!!!</Typography>
                }
            </Box>
            <div className="collection_listing_show_all">
                <Typography variant="subtitle1">
                    <Link to="/collections">{`Show All (${collections.length})`}</Link>
                </Typography>
            </div>
        </Paper>
    );
};

export default CollectionListing;