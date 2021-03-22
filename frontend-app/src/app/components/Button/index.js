import React from 'react';
import { Button as MuiButton } from '@material-ui/core';

import './Button.scss';

const Button = ({ shade, children, ...rest }) => {
    return (
        <>
            {
                shade ?
                    <MuiButton {...rest} className={`shade shade__${shade}`}>{children}</MuiButton> :
                    <MuiButton {...rest}>{children}</MuiButton>
            }
        </>
    );
};

export default Button;