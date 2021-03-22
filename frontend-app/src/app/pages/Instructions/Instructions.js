import React from 'react';

import PlayerInstructions from '../../containers/PlayerInstructions/PlayerInstructions';
import './Instructions.scss';

const Instructions = () => {
    return (
        <div className="instructions-page__wrapper">
            <PlayerInstructions />
        </div>
    )
};

export default Instructions;