import React from 'react';
import { Card as MuiCard, CardContent, CardMedia, Typography } from '@material-ui/core';

import { getAsset } from '../../../config/Utils';
import Button from '../Button';

import './KahootCard.scss';

const KahootCard = ({ title, subTitle, additionalInfo, visibility, onEditClick, onPlayClick }) => {
    return (
        <MuiCard className="kahoot_card">
            <CardMedia
                className="kahoot_card_media"
                image={getAsset("logo_dark.png", "img")}
                title="Kahoot Image"
            />
            <div className="kahoot_card_content">
                <CardContent className="kahoot_card_content_wrapper">
                    <Typography className="kahoot_card_content_wrapper_title" noWrap variant="h6">
                        {title}
                    </Typography>
                    <div className="kahoot_card_content_wrapper_info">
                        <Typography className="kahoot_card_content_wrapper_info_subTitle" variant="body2">
                            {subTitle}
                        </Typography>
                        <Typography className="kahoot_card_content_wrapper_info_additionalInfo" variant="caption">
                            {additionalInfo}
                        </Typography>
                    </div>
                    <div className="kahoot_card_content_wrapper_footer">
                        <Typography className="kahoot_card_content_wrapper_footer_left" variant="body2">
                            {visibility ? 'Visible to everyone' : 'Only me'}
                        </Typography>
                        <div className="kahoot_card_content_wrapper_footer_actions">
                            <div className="kahoot_card_content_wrapper_footer_actions_button">
                                <Button variant="contained" color="primary" shade="green" size="medium" onClick={onPlayClick}>Play</Button>
                            </div>
                            <div className="kahoot_card_content_wrapper_footer_actions_button">
                                <Button variant="contained" color="primary" size="medium" onClick={onEditClick}>Edit</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </MuiCard>
    );
};

export default KahootCard;