import React from 'react';
import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Radio, Select } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';

import TextField from '../TextField';
import Button from '../Button';

import './CreateOrUpdateKahoot.scss';

const CreateOrUpdateKahoot = ({ id, question, handleChange, handleQuestionAddition, handleQuestionSave, handleQuestionDeletion }) => {
    return (
        question &&
        <Box className="create_update_kahoot_wrapper">
            <div className="create_update_kahoot">
                <Card className="create_update_kahoot_card">
                    <TextField
                        name="question"
                        className="create_update_kahoot_card_textfield"
                        fullWidth
                        placeholder="Start typing your question"
                        required
                        type="text"
                        variant="outlined"
                        value={question.question}
                        onChange={(e) => handleChange(e, id)}
                    />
                </Card>
                <Grid container className="create_update_kahoot_choices">
                    {
                        question?.choices?.length > 0 &&
                        question.choices.map((choice, index) =>
                            <Grid item xs={12} sm={6} className="create_update_kahoot_choices_each" key={index}>
                                <Card className="create_update_kahoot_choices_each_card">
                                    <TextField
                                        id={`answer_text_${index}`}
                                        name="answer"
                                        className="create_update_kahoot_choices_each_card_choice"
                                        fullWidth
                                        placeholder="Add answer"
                                        required
                                        type="text"
                                        variant="outlined"
                                        value={choice.answer}
                                        onChange={(e) => handleChange(e, id, "choices", index)}
                                    />
                                    <Radio
                                        id={`correct_radio_${index}`}
                                        name="correct"
                                        className="create_update_kahoot_choices_each_card_radio"
                                        checked={choice.correct}
                                        onChange={(e) => handleChange(e, id, "choices", index, "correct")}
                                        inputProps={{ 'aria-label': 'A' }}
                                    />
                                </Card>
                            </Grid>
                        )
                    }
                </Grid>
            </div>
            <div className="create_update_config">
                <div className="create_update_config_options">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id={`question_type_${question.questionNumber}`}>Question Type</InputLabel>
                        <Select
                            labelId={`question_type_${question.questionNumber}`}
                            name="type"
                            value={question.type}
                            onChange={(e) => handleChange(e, id)}
                        >
                            <MenuItem value="quiz">Quiz</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="create_update_config_options">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Time Limit</InputLabel>
                        <Select
                            name="time"
                            value={question.time}
                            onChange={(e) => handleChange(e, id)}
                        >
                            <MenuItem value="5">5 second</MenuItem>
                            <MenuItem value="10">10 second</MenuItem>
                            <MenuItem value="20">20 second</MenuItem>
                            <MenuItem value="30">30 second</MenuItem>
                            <MenuItem value="60">60 second</MenuItem>
                            <MenuItem value="90">90 second</MenuItem>
                            <MenuItem value="120">120 second</MenuItem>
                            <MenuItem value="240">240 second</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="create_update_config_options">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Points</InputLabel>
                        <Select
                            name="pointsMultiplier"
                            value={question.pointsMultiplier}
                            onChange={(e) => handleChange(e, id)}
                        >
                            <MenuItem value="1">Standard</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="create_update_config_options">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Answer Options</InputLabel>
                        <Select
                            name="answerOptions"
                            value={question.pointsMultiplier}
                            onChange={(e) => handleChange(e, id)}
                        >
                            <MenuItem value="1">Single Select</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="create_update_config_options">
                    <div className="btn_add_left">
                        <Button
                            variant="contained"
                            shade="red"
                            size="large"
                            className="create_update_config_options_btn"
                            fullWidth
                            onClick={handleQuestionDeletion}
                        >
                            <CloseIcon />
                        </Button>
                    </div>
                    <div className="btn_add_right btn_add_left">
                        <Button
                            variant="contained"
                            shade="green"
                            size="large"
                            className="create_update_config_options_btn"
                            fullWidth
                            onClick={handleQuestionAddition}
                        >
                            <AddIcon />
                        </Button>
                    </div>
                    <div className="btn_add_right">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className="create_update_config_options_btn"
                            fullWidth
                            onClick={handleQuestionSave}
                        >
                            <SaveIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default CreateOrUpdateKahoot;