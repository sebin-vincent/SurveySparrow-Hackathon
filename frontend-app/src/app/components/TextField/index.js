import React from 'react';
import { TextField as MuiTextField } from '@material-ui/core';

import './TextField.scss';

const TextField = ({ ...rest }) => {
    return (
        <>
            <MuiTextField {...rest} />
        </>
    );
};

export default TextField;