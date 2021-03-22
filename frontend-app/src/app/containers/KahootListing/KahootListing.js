import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { Link, useHistory } from 'react-router-dom';

import Card from '../../components/Card';
import { getAllKahoots } from '../../../api/service/Kahoot.service';
import Button from '../../components/Button';

import './KahootListing.scss';

const KahootListing = () => {
    const [kahoots, setKahoots] = useState([]);

    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        getKahoots.current();
    }, []);

    const getKahoots = useRef(() => { });
    getKahoots.current = () => {
        getAllKahoots()
            .then(response => {
                setKahoots(response);
            })
            .catch(error => {
                enqueueSnackbar(JSON.stringify(error.message), { variant: 'error' });
            })
    };

    return (
        <Paper className="kahoot_listing">
            <div className="kahoot_listing_header">
                <Typography variant="h6" component="h6" className="kahoot_listing_header_title">My Kahoots</Typography>
                <Button shade="blue" size="small" onClick={() => { history.push("/kahoot/create") }}>Create</Button>
            </div>
            <Box className="kahoot_listing_cards">
                {
                    kahoots && kahoots.length > 0 ?
                        kahoots.map(kahoot =>
                            <div className="kahoot_listing_cards_each" key={kahoot.id} onClick={() => { history.push(`/kahoot/${kahoot.id}`) }}>
                                <Card
                                    title={kahoot.title}
                                    subTitle={kahoot.createdByName}
                                    additionalInfo={`${kahoot.questions.length} Questions`}
                                />
                            </div>
                        ) :
                        <Typography variant="subtitle1">No kahoots found!!!</Typography>
                }
            </Box>
            <div className="kahoot_listing_show_all">
                <Typography variant="subtitle1">
                    <Link to='/kahoots'>{`Show All (${kahoots.length})`}</Link>
                </Typography>
            </div>
        </Paper>
    );
};

export default KahootListing;