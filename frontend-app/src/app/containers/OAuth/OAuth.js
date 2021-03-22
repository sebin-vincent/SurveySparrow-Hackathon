import React from 'react';
import { useSnackbar } from 'notistack';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { clearNextUrl } from '../../../redux/actions/App.actions';
import { getGoogleClientId, setToken } from '../../../config/Utils';
import { getGoogleAccessToken } from '../../../api/service/Auth.service';
import './OAuth.scss';

const OAuth = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const GOOGLE_CLIENT_ID = getGoogleClientId();
    const nextUrl = useSelector(state => state.AppReducer.nextUrl);


    const responseGoogle = (token) => {
        let tokenId = token && token.tokenId ? token.tokenId : null;

        if (tokenId) {
            getGoogleAccessToken(tokenId)
                .then(response => {
                    let accessToken = response.accessToken
                    let refreshToken = response.refreshToken
                    let googleIdToken = tokenId;
                    setToken(accessToken, refreshToken, googleIdToken);
                    if (nextUrl) {
                        history.push(nextUrl);
                        dispatch(clearNextUrl());
                    } else {
                        history.push('/dashboard');
                    }
                })
                .catch(error => {
                    enqueueSnackbar(JSON.stringify(error), { variant: 'error' });
                });
        }
        else {
            enqueueSnackbar(token.error, { variant: 'error' });
        }
    }

    return (
        <div className="oauth__wrapper">
            <div className="oauth__container">
                <GoogleLogin
                    className="btn-google-signin"
                    clientId={GOOGLE_CLIENT_ID}
                    buttonText="Sign in with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </div>
    );
};

export default OAuth;