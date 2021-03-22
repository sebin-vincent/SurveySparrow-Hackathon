import React, { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Backdrop, Card, CardContent, CircularProgress, Typography } from '@material-ui/core';

import Socket from '../../../api/Socket';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { setGamePin, setPlayerName } from '../../../redux/actions/Game.actions';
import './WSAuth.scss';

const WSAuth = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [pin, setPin] = useState("");
    const [nickname, setNickname] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValidGamePin, setIsValidGamePin] = useState(false);

    useEffect(() => {
        onJoinedGame.current();
    }, []);

    const resetState = () => {
        setPin("");
        setNickname("");
    };

    const joinGame = useRef(() => { });
    joinGame.current = (request) => {
        Socket.emit('JOIN_GAME', request);
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); }, 10000);
    };

    const onJoinedGame = useRef(() => { });
    onJoinedGame.current = () => {
        Socket.on('JOINED_GAME', ({ status, message }) => {
            setIsLoading(false);
            if (status) {
                resetState();
                history.push('/start');
            } else {
                enqueueSnackbar(message, { variant: 'error' });
                setIsValidGamePin(false);
            }
        });
    };

    const handlePinChange = (e) => {
        setPin(e.target.value);
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const validatePin = ({ pin }) => {
        let isValid = true;

        if (!pin.trim()) {
            enqueueSnackbar("Game PIN is required!!!", { variant: 'error' });
            isValid = false;
        }

        return isValid;
    };

    const validateNickname = ({ name }) => {
        let isValid = true;

        if (!name.trim()) {
            enqueueSnackbar("Nickname is required!!!", { variant: 'error' });
            isValid = false;
        }

        return isValid;
    };

    const handleGamePinSubmit = (e) => {
        e.preventDefault();
        let responseBody = { pin };
        let isValid = validatePin(responseBody);

        if (isValid) {
            setIsValidGamePin(true);
        }
    };

    const handleNicknameSubmit = (e) => {
        e.preventDefault();
        let responseBody = { name: nickname };
        let isValid = validateNickname(responseBody);

        if (isValid) {
            let req = { gamePin: pin, name: nickname };
            dispatch(setPlayerName(nickname));
            dispatch(setGamePin(pin));
            joinGame.current(req);
        }
    };

    return (
        <div className="ws-auth__wrapper">
            <Backdrop open={isLoading} className="backdrop">
                <Typography variant="h5">Connecting to Kahoot!</Typography>
                <CircularProgress />
            </Backdrop>
            <div className="ws-auth__container">
                <div className="logo"></div>
                <Card className="card-wrapper">
                    <CardContent className="card-content">
                        {
                            isValidGamePin ?
                                <form className="game-form" onSubmit={(e) => handleNicknameSubmit(e)}>
                                    <TextField
                                        fullWidth
                                        value={nickname}
                                        variant="outlined"
                                        placeholder="Nickname"
                                        onChange={handleNicknameChange}
                                    />
                                    <Button
                                        fullWidth
                                        color="secondary"
                                        variant="contained"
                                        onClick={handleNicknameSubmit}
                                    >
                                        OK, go!
                                    </Button>
                                </form> :
                                <form className="game-form" onSubmit={(e) => handleGamePinSubmit(e)}>
                                    <TextField
                                        fullWidth
                                        value={pin}
                                        variant="outlined"
                                        placeholder="Game PIN"
                                        onChange={handlePinChange}
                                    />
                                    <Button
                                        fullWidth
                                        color="secondary"
                                        variant="contained"
                                        onClick={handleGamePinSubmit}
                                    >
                                        Enter
                                    </Button>
                                </form>
                        }
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WSAuth;