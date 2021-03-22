import React from 'react';
import { Card as MuiCard, CardContent, CardMedia, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import { getAsset } from '../../../config/Utils';

import './QuestionCard.scss';

const QuestionCard = ({ questionNumber, question, type, choices, showAnswer, ...rest }) => {
    return (
        <>
            <MuiCard className="question_card" {...rest}>
                <div className="question_card_top">
                    <div className="question_card_top_question">
                        <CardContent className="question_card_top_question_content">
                            <Typography className="question_card_top_question_content_header" noWrap component="h6" variant="h6">
                                {`${questionNumber} - ${type}`}
                            </Typography>
                            <Typography variant="h6" className="question_card_top_question_content_title">
                                {question}
                            </Typography>
                        </CardContent>
                    </div>
                    <CardMedia
                        className="question_card_top_media"
                        image={getAsset("logo_dark.png", "img")}
                        title="Question"
                    />
                </div>
                <div className="question_card_answers">
                    {
                        showAnswer && choices && choices.length &&
                        choices.map(choice =>
                            <div className="question_card_answers_each" key={choice.id}>
                                <Typography>{choice.answer}</Typography>
                                {choice.correct ?
                                    <CheckIcon color="action" fontSize="large" /> :
                                    <CloseIcon color="error" fontSize="large" />}
                            </div>
                        )
                    }
                </div>
            </MuiCard>
        </>
    );
};

export default QuestionCard;