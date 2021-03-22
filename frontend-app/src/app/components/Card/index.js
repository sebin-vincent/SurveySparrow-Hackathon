import React from 'react';
import { Card as MuiCard, CardContent, Typography } from '@material-ui/core';
import { CardMedia } from '@material-ui/core';

import { getAsset } from '../../../config/Utils';
import './Card.scss';

const Card = ({ title, subTitle, additionalInfo, ...rest }) => {
    return (
        <MuiCard className="mui-card-wrapper" {...rest}>
            <CardMedia
                className="mui-card-media"
                image={getAsset("logo_dark.png", "img")}
                title='Image'
            />
            <div className="mui-card-content-wrapper">
                <CardContent className="mui-card-content">
                    <Typography className="mui-card-content-title" noWrap component="h6" variant="h6">
                        {title}
                    </Typography>
                    <div className="mui-card-footer">
                        <Typography className="mui-card-footer-subtitle" noWrap component="h6" variant="body2">
                            {subTitle}
                        </Typography>
                        <Typography className="mui-card-footer-additionalInfo" noWrap component="h6" variant="caption">
                            {additionalInfo}
                        </Typography>
                    </div>
                </CardContent>
            </div>
        </MuiCard>
    );
};

export default Card;