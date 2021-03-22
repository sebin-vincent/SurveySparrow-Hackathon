import React, { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Typography } from '@material-ui/core';

import Socket from '../../../api/Socket';
import Button from '../../components/Button';
import './GameBlockHost.scss';

const GameBlockHost = () => {

    const CHOICES = ["a", "b", "c", "d"];
    const SHADES = ["red", "blue", "green", "yellow"];
    const DEFAULT_TIMER_VALUE = 20;

    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [question, setQuestion] = useState("When was SurveySparrow founded?")
    const [answers, setAnswers] = useState(["2010", "2016", "2017", "2013"])

    const name = useSelector(state => state.GameReducer.playerName);
    const gamePin = useSelector(state => state.GameReducer.gamePin);

    const [timer, setTimer] = useState(DEFAULT_TIMER_VALUE);

    useEffect(() => {
        let timeout = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000);

        if (!timer) {
            history.push('/ready-host');
            clearInterval(timeout);
            setTimer(0)
        }

        return () => {
            clearInterval(timeout);
        };
    });

    useEffect(() => {
        onAnswerSubmit.current();
    }, []);

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
        <div className="game-block-host__wrapper">
            <div className="game-block-host__container">
                <div className="header">
                    <span>Quiz</span>
                </div>
                <div className="content-container">
                    <div className="action-head">
                        <span className="timer">{timer}</span>
                        <Button variant="contained" color="secondary">Next</Button>
                    </div>
                    <p className="question-statement">{question}</p>
                    <div className="choice-container">
                        {
                            CHOICES.map((choice, index) =>
                                <Button key={choice} shade={SHADES[index]}>{answers[index]}</Button>
                            )
                        }
                    </div>
                </div>
                <div className="player-details">
                    {/* <Typography variant="h6">{name}</Typography> */}
                </div>
            </div>
        </div>
    )
};

export default GameBlockHost;