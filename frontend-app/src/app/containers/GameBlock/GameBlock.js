import React, { useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Typography } from '@material-ui/core';

import Socket from '../../../api/Socket';
import Button from '../../components/Button';
import './GameBlock.scss';

const GameBlock = () => {

    const CHOICES = ["a", "b", "c", "d"];
    const SHADES = ["red", "blue", "green", "yellow"];

    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const name = useSelector(state => state.GameReducer.playerName);
    const gamePin = useSelector(state => state.GameReducer.gamePin);

    useEffect(() => {
        onAnswerSubmit.current();
    }, []);

    const handleClick = (option) => {
        handleSubmitAnswer(option);
    }

    const handleSubmitAnswer = (choice) => {
        let request = { gamePin, choice };

        Socket.emit('SUBMIT_ANSWER', request);
    }

    const onAnswerSubmit = useRef(() => { });
    onAnswerSubmit.current = () => {
        Socket.on('ANSWER_SUBMITED', ({ status, message }) => {
            if (status) {
                history.push('/ready');
            } else {
                enqueueSnackbar(message, { variant: 'error' });
                setTimeout(() => {
                    history.push('/');
                }, 1000)
            }
        });
    };

    return (
        <div className="game-block__wrapper">
            <div className="game-block__container">
                <div className="header">
                    <span>Quiz</span>
                </div>
                <div className="content-container">
                    {
                        CHOICES.map((choice, index) =>
                            <Button key={choice} shade={SHADES[index]} onClick={() => handleClick(choice)}></Button>
                        )
                    }
                </div>
                <div className="player-details">
                    <Typography variant="h6">{name}</Typography>
                </div>
            </div>
        </div>
    )
};

export default GameBlock;