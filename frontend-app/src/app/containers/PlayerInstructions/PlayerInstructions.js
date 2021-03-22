import React from 'react';
import { Typography } from '@material-ui/core';

import './PlayerInstructions.scss';

const PlayerInstructions = ({ name = 'Player 1' }) => {
    return (
        <div className="player-instructions__wrapper background-common">
            <div className="player-instructions__container">
                <Typography variant="h3" gutterBottom>You're in!</Typography>
                <Typography variant="h5">See your nickname on screen?</Typography>
                <div className="player-details">
                    <Typography variant="h6">{name}</Typography>
                </div>
            </div>
        </div>
    );
};

export default PlayerInstructions;