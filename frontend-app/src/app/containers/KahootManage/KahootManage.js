import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';

import { getAllKahoots } from '../../../api/service/Kahoot.service';
import Button from '../../components/Button';
import KahootCard from '../../components/KahootCard';
import { formatDate } from '../../../config/Utils';

import './KahootManage.scss';

const KahootManage = () => {
    const [kahoots, setKahoots] = useState([]);

    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();

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
                enqueueSnackbar(error.message, { variant: 'error' });
            })
    };

    const handleEditClick = (e, kahootId) => {
        e.preventDefault();
        e.stopPropagation();
        history.push(`/kahoot/${kahootId}/edit`);
    };

    return (
        <>
            <Box className="kahoot_manage">
                <div className="kahoot_manage_header">
                    <Typography variant="h5" className="kahoot_manage_header_title">My Kahoots</Typography>
                    <Button variant="contained" color="primary" size="large" onClick={() => { history.push("/kahoot/create") }}>Create</Button>
                </div>
                <Grid container className="kahoot_manage_body">
                    {
                        kahoots && kahoots.length > 0 ?
                            kahoots.map(kahoot =>
                                <Grid item xs={12} sm={12} className="kahoot_manage_body_tile" key={kahoot.id} onClick={() => { history.push(`/kahoot/${kahoot.id}`) }}>
                                    <KahootCard
                                        title={kahoot.title}
                                        subTitle={kahoot.createdByName}
                                        additionalInfo={formatDate(kahoot.createdOn, "LL")}
                                        visibility={true}
                                        onEditClick={(e) => handleEditClick(e, kahoot.id)}
                                    />
                                </Grid>
                            ) :
                            <Typography variant="subtitle1">No kahoots found!!!</Typography>
                    }
                </Grid>
            </Box>
        </>
    );
};

export default KahootManage;