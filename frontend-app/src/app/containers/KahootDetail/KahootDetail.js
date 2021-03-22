import { Box, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSnackbar } from 'notistack';

import { formatDate, getAsset } from '../../../config/Utils';
import { deleteKahoot, getKahootDetail } from '../../../api/service/Kahoot.service';
import Button from '../../components/Button';
import AvatarInfo from '../../components/AvatarInfo';
import QuestionCard from '../../components/QuestionCard';
import ConfirmationDialog from '../../components/ConfirmationDialog';

import './KahootDetail.scss';

const KahootDetail = () => {
    const [kahoot, setKahoot] = useState({});
    const [showAnswer, setShowAnswer] = useState(false);
    const [openDeleteKahoot, setOpenDeleteKahoot] = useState(false);

    const params = useParams();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        getKahootDetailById.current(params.id);
    }, [params]);

    const getKahootDetailById = useRef(() => { });
    getKahootDetailById.current = (id) => {
        getKahootDetail(id)
            .then(response => {
                setKahoot(response);
            })
            .catch(error => {
                enqueueSnackbar(error.message, { variant: 'error' });
            });
    };

    const toggleShowAnswer = () => {
        setShowAnswer(open => !open);
    };

    const handleOpenDeleteKahoot = () => {
        setOpenDeleteKahoot(open => !open);
    };

    const handleKahootDeleteConfirmation = () => {
        handleOpenDeleteKahoot();
    };

    const handleDeleteKahoot = () => {
        deleteKahoot(params.id)
            .then(response => {
                enqueueSnackbar("Kahoot deleted", { variant: 'success' });
                handleOpenDeleteKahoot();
                history.push('/kahoots');
            })
            .catch(error => {
                enqueueSnackbar(error.message, { variant: 'error' });
            });
    };

    const handleKahootEdit = () => {
        history.push(`/kahoot/${params.id}/edit`);
    }

    const handleKahootPlay = () => {
        history.push(`/room/${params.id}`);
    };

    return (
        <>
            <Grid container className="kahoot_detail">
                <Grid item xs={12} sm={4} className="kahoot_detail_left">
                    <Box className="kahoot_detail_left_section">
                        <img src={getAsset("logo_dark.png", "img")} alt="Kahoot" className="kahoot_detail_left_section_image" />
                        <Box className="kahoot_detail_left_section_content">
                            <Typography className="kahoot_detail_left_section_content_title" variant="h5">{kahoot.title}</Typography>
                            <div className="kahoot_detail_left_section_content_actions">
                                <div className="kahoot_detail_left_section_content_actions_button">
                                    <Button variant="contained" color="primary" shade="green" size="medium" disabled={!kahoot.ready} onClick={handleKahootPlay}>Play</Button>
                            </div>
                            <div className="kahoot_detail_left_section_content_actions_button">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    onClick={handleKahootEdit}
                                >Edit</Button>
                            </div>
                            <div className="kahoot_detail_left_section_content_actions_button">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    shade="red"
                                    size="medium"
                                    onClick={handleKahootDeleteConfirmation}
                                >Delete</Button>
                            </div>
                            </div>
                        <Typography
                            className="kahoot_detail_left_section_content_description"
                            variant="body1"
                        >
                            {kahoot.description}
                        </Typography>

                        <AvatarInfo
                            title={kahoot.createdByName}
                            subTitle={formatDate(kahoot.createdOn, "LL")}
                        />
                    </Box>
                    </Box>
            </Grid>
            <Grid item xs={12} sm={8} className="kahoot_detail_right">
                <div className="kahoot_detail_right_header">
                    <Typography variant="h6" className="kahoot_detail_right_header_heading">
                        {`Questions (${(kahoot && kahoot.questions && kahoot.questions.length > 0) ? kahoot.questions.length : 0})`}
                    </Typography>
                    {
                        kahoot?.questions?.length > 0 &&
                        <Typography
                            className="kahoot_detail_right_header_show"
                            onClick={toggleShowAnswer}
                        >
                            {showAnswer ? "Hide All Answers" : "Show all answers"}
                        </Typography>
                    }
                </div>
                {
                    kahoot?.questions?.length > 0 &&
                    kahoot.questions.map(question =>
                        <Box key={question.id} className="kahoot_detail_right_card">
                            <QuestionCard
                                questionNumber={question.questionNumber}
                                question={question.question}
                                type={question.type}
                                choices={question.choices}
                                showAnswer={showAnswer}
                            />
                        </Box>
                    )
                }
            </Grid>
        </Grid>
        <ConfirmationDialog
            isOpen={openDeleteKahoot}
            handleClose={handleOpenDeleteKahoot}
            maxWidth="sm"
            title="Delete Kahoot"
            content={`Are you sure you want to delete "${kahoot.title}"? This action can't be undone.`}
            submitProps={{ label: 'Delete', variant: 'contained', shade: 'red' }}
            handleSubmit={handleDeleteKahoot}
            cancelProps={{ label: 'Cancel', variant: 'contained' }}
        />
        </>
    );
};

export default KahootDetail;