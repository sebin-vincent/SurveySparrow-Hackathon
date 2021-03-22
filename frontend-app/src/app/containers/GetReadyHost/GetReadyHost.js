import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

import './GetReadyHost.scss';

const GetReadyHost = () => {

    const DEFAULT_TIMER_VALUE = 4;
    const history = useHistory();
    const name = useSelector(state => state.GameReducer.playerName);
    const [timer, setTimer] = useState(DEFAULT_TIMER_VALUE);

    useEffect(() => {
        let timeout = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000);

        if (!timer) {
            history.push('/game-host');
        }

        return () => {
            clearInterval(timeout);
        };
    });

    return (
        <div className="get-ready__wrapper background-common">
            <div className="get-ready__container">
                <div className="header">
                    <span>Quiz</span>
                </div>
                <div className="timer">
                    <Typography variant="h5" color="primary">{timer}</Typography>
                </div>
                <Typography variant="h5">Ready...</Typography>
                <div className="player-details">
                    {/* <Typography variant="h6">{name}</Typography> */}
                </div>
            </div>
        </div>
    );
};

export default GetReadyHost;