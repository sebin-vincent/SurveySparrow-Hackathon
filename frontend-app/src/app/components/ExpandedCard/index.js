import React from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core';

import { getAsset } from '../../../config/Utils';
import Button from '../Button/index';
import './ExpandedCard.scss';

const ExpandedCard = ({ id, title, subTitle, actionButtons, collection }) => {
    return (
        <Card className="expanded_card">
            <CardActionArea className="expanded_card_action_area">
                <CardMedia
                    className="expanded_card_action_area_media"
                    image={getAsset("logo_dark.png", "img")}
                    title='Image'
                />
                <CardContent className="expanded_card_action_area_content">
                    <Typography className="expanded_card_action_area_content_title" variant="h5">{title}</Typography>
                    <Typography variant="body1">{subTitle}</Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className="expanded_card_actions">
                {
                    actionButtons && actionButtons.length > 0 &&
                    actionButtons.map(button =>
                        <Button color="primary" shade={button.shade} key={button.name} onClick={() => button.action(collection)}>
                            {button.name}
                        </Button>
                    )
                }
            </CardActions>
        </Card>
    );
};

export default ExpandedCard;