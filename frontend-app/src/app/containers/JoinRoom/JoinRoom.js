import React, { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router';
import { Icon, Typography } from '@material-ui/core';

import Socket from '../../../api/Socket';
import Button from '../../components/Button';
import { getAccessToken } from '../../../config/Utils';
import './JoinRoom.scss';

const JoinRoom = () => {
    const params = useParams();
    const history = useHistory();

    const [players, setPlayers] = useState([]);
    const [gamePin, setGamePin] = useState("");

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (params?.id) {
            let request = {
                kahootId: params.id,
                token: getAccessToken()
            };
            createGame.current(request);
        }
        onCreateGame.current();
        onJoinedRoom.current();
    }, [params]);

    const createGame = useRef(() => { });
    createGame.current = (req) => {
        Socket.emit('CREATE_GAME', req);
    };

    const onCreateGame = useRef(() => { });
    onCreateGame.current = () => {
        Socket.on('CREATED_GAME', ({ status, pin, message }) => {
            if (status) {
                setGamePin(pin);
                setTimeout(() => { setPlayers(p => [...p, "Sebin"]) }, 3000);
                setTimeout(() => { setPlayers(p => [...p, "Shaheer"]) }, 5000);
                setTimeout(() => { setPlayers(p => [...p, "Saumya"]) }, 6000);
                setTimeout(() => { setPlayers(p => [...p, "Benin"]) }, 8000);
            } else {
                enqueueSnackbar(message, { variant: 'error' });
                history.push('/');
            }
        });
    };

    const onJoinedRoom = useRef(() => { });
    onJoinedRoom.current = () => {
        Socket.on('JOINED_GAME', ({ status, name, message }) => {
            if (status) {
                let newPlayerList = players;
                newPlayerList.push(name);
                setPlayers(newPlayerList);
            } else {
                enqueueSnackbar(message, { variant: 'error' });
                history.push('/');
            }
        });
    };

    const handleGameStart = () => {
        history.push('/ready-host');
    };

    return (
        <div className="join-room__wrapper background-common">
            <div className="join-room__container">
                {
                    !gamePin ?
                        <div className="loading-container">
                            <Typography variant="h3">Get ready to join</Typography>
                            <div className="pin-board">
                                <span className="board-header">Game PIN:</span>
                                <span>Join at www.kahoot.it</span>
                                <span className="pin loading">Loading Game PIN...</span>
                            </div>
                        </div> :
                        <div className="ready-container">
                            <div className="header-section">
                                <div className="pin-board">
                                    <span className="board-header">Game PIN:</span>
                                    <span>Join at www.kahoot.it</span>
                                    <span className="pin">{gamePin}</span>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content-section__header">
                                    <div className="people">
                                        <Icon>perm_identity</Icon>{players.length}
                                    </div>
                                    <div className="actions">
                                        <Button color="default" variant="contained" onClick={handleGameStart} disabled={!players.length ? true : false}>Start</Button>
                                    </div>
                                </div>
                                {
                                    !players.length ?
                                        <span className="tag">Waiting for players...</span> :
                                        <>
                                            {
                                                players.map((p) =>
                                                    <span key={p} className="tag">{p}</span>
                                                )
                                            }
                                        </>
                                }
                            </div>
                        </div>}
            </div>
        </div>
    )
};

export default JoinRoom;