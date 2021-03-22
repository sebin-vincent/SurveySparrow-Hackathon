import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Typography, CircularProgress } from '@material-ui/core';

import Socket from '../../../api/Socket';
import './GameStart.scss';

const GameStart = () => {

    const history = useHistory();
    const name = useSelector(state => state.GameReducer.playerName);

    useEffect(() => {
        getWarmupTime.current();

        setTimeout(() => { history.push('/ready'); }, 5000)
    }, []);

    const getWarmupTime = useRef(() => { });
    getWarmupTime.current = () => {
        Socket.on('STARTED_GAME', (response) => {
            if (response?.status) {
                history.push('/ready');
            }
        });
    };

    return (
        <div className="game-start__wrapper background-common">
            <div className="game-start__container">
                <Typography variant="h3" gutterBottom>Get Ready!</Typography>
                <CircularProgress />
                <Typography variant="h5">Loading...</Typography>
                <div className="player-details">
                    <Typography variant="h6">{name}</Typography>
                </div>
            </div>
        </div>
    );
};

export default GameStart;