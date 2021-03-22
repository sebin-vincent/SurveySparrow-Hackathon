import { Avatar, Box, Typography } from '@material-ui/core';
import React from 'react';

import './AvatarInfo.scss';

const AvatarInfo = ({ title, subTitle, size }) => {

    const generateDisplayName = name => {
        const nameParts = name.split(' ').filter(part => part.length >= 1);
        return (nameParts[0].charAt(0) + (size !== 'small' && nameParts.length > 1 ? nameParts[1].charAt(0) : ''));
    };

    return (
        <Box className="avatar_info">
            <Box className="avatar_info_container">
                <Box className="avatar_info_container_col">
                    <Avatar className="avatar_info_container_col_img">
                        {title && generateDisplayName(title).toUpperCase()}
                    </Avatar>
                </Box>
                <Box>
                    {
                        (title || subTitle) &&
                        <Box className="avatar_info_container_col_content">
                            {title && <Typography className="avatar_info_container_col_title" variant="body2">{title}</Typography>}
                            {subTitle && <Typography className="avatar_info_container_col_subTitle" variant="body2">{subTitle}</Typography>}
                        </Box>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default AvatarInfo;