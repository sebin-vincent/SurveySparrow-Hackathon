import { Card, CardContent, Grid } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router';

import { DEFAULT_QUESTION_STATE } from '../../../config/Utils';
import CreateOrUpdateKahoot from '../../components/CreateOrUpdateKahoot';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { addQuestion, deleteQuestion, draftKahoot, getKahootDetail, updateKahoot, updateQuestion } from '../../../api/service/Kahoot.service';

import './KahootCreateOrEdit.scss';

const KahootCreateOrEdit = () => {
    const [kahootBasics, setKahootBasics] = useState({ "title": "", "description": "" });
    const [kahootDetail, setKahootDetail] = useState({});
    const [questions, setQuestions] = useState([DEFAULT_QUESTION_STATE]);

    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            getKahootDetailById.current(params.id);
        }
    }, [params]);

    const getKahootDetailById = useRef(() => { });
    getKahootDetailById.current = (id) => {
        getKahootDetail(id)
            .then(response => {
                setKahootBasics({ title: response.title, description: response.description });
                setKahootDetail(response);
                setQuestions(response?.questions?.length > 0 ? response.questions : [DEFAULT_QUESTION_STATE]);
            })
            .catch(error => {
                enqueueSnackbar(error.message, { variant: 'error' });
            });
    };

    const handleKahootBasicsChange = (e) => {
        let kahootBasic = {
            ...kahootBasics,
            [e.target.name]: e.target.value
        };
        setKahootBasics(kahootBasic);
    };

    const validateKahootRequest = (request) => {
        let isValid = true;
        if (!request.title) {
            isValid = false;
            enqueueSnackbar("Title is required", { variant: 'warning' })
        }
        return isValid;
    };

    const handleKahootDraft = () => {
        const isValid = validateKahootRequest(kahootBasics);
        if (!isValid) {
            return;
        }
        kahootDetail && kahootDetail.id ?
            updateKahoot(kahootDetail.id, kahootBasics)
                .then(response => {
                    setKahootBasics({ title: response.title, description: response.description });
                    setKahootDetail(response);
                    enqueueSnackbar("Kahoot updated", { variant: 'success' });
                })
                .catch(error => {
                    enqueueSnackbar(error.message, { variant: 'error' });
                }) :
            draftKahoot(kahootBasics)
                .then(response => {
                    setKahootBasics({ title: response.title, description: response.description });
                    setKahootDetail(response);
                    enqueueSnackbar("Kahoot drafted", { variant: 'success' });
                    // resetKahootBasics();
                })
                .catch(error => {
                    enqueueSnackbar(error.message, { variant: 'error' });
                });
    };

    const handleChange = (e, index, isChoice, choiceIndex, isRadio) => {
        let key = e.target.name;
        let value = isRadio ? e.target.checked : e.target.value;

        let questionList = [...questions];
        let question = { ...questionList[index] }
        let choices = [...question["choices"]];
        if (isChoice) {
            if (isRadio) {
                choices.map(choice => choice.correct = false);
            }
            choices[choiceIndex] = {
                ...choices[choiceIndex],
                [key]: value
            };
            question["choices"] = [...choices];
            questionList[index] = { ...question };
        } else {
            questionList[index] = {
                ...questionList[index],
                [key]: value
            };
        }
        setQuestions(questionList);
    };

    const handleQuestionAddition = (index) => {
        let qns = [
            ...questions,
        ];
        qns.push({ ...DEFAULT_QUESTION_STATE, questionNumber: questions.length + 1 });
        // qns.splice(index + 1, index, { ...DEFAULT_QUESTION_STATE, questionNumber: questions.length + 1 });
        // let updatedQuestions = [
        //     ...qns.slice(0, index - 1),
        //     { ...DEFAULT_QUESTION_STATE, questionNumber: questions.length + 1 },
        //     ...qns.slice(index + 1)
        // ];
        setQuestions(qns);
    };

    const validateQuestionRequest = (request) => {
        let isValid = true;
        if (!request.question) {
            isValid = false;
            enqueueSnackbar("Question is required", { variant: 'warning' });
        }
        else if (!(request.choices && request.choices.length !== 4)) {
            if (request.choices.length !== 4) {
                isValid = false;
                enqueueSnackbar("There must be 4 choices", { variant: 'warning' });
            }
            request.choices.forEach(choice => {
                delete choice.id;
                if (!choice.answer) {
                    isValid = false;
                }
            });
            if (!isValid) {
                enqueueSnackbar("Answer is required for all choices", { variant: 'warning' });
            } else {
                const correctChoices = request.choices.filter(choice => choice.correct === true).length;
                if (correctChoices !== 1) {
                    isValid = false;
                    enqueueSnackbar("One answer must be selected as correct", { variant: 'warning' });
                }
            }
        }
        return isValid;
    };

    const handleQuestionSave = (index) => {
        if (!kahootDetail.id) {
            enqueueSnackbar("Draft a kahoot with title", { variant: 'error' });
            return;
        }
        const kahootId = kahootDetail.id;
        const selectedQuestion = questions[index];
        const questionId = kahootDetail?.questions?.length > 0 ? kahootDetail.questions[index]?.id : '';
        const isValid = validateQuestionRequest(selectedQuestion);
        if (!isValid) {
            return;
        }
        if (questionId) {
            delete selectedQuestion.id;
            delete selectedQuestion.answerOptions;
            updateQuestion(kahootId, questionId, selectedQuestion)
                .then(response => {
                    setKahootBasics({ title: response.title, description: response.description });
                    setKahootDetail(response);
                    setQuestions(response?.questions?.length > 0 ? response.questions : [DEFAULT_QUESTION_STATE]);
                    enqueueSnackbar("Question Updated", { variant: 'success' });
                })
                .catch(error => {
                    enqueueSnackbar(error.message, { variant: 'error' });
                });
        }
        else if (!questionId) {
            delete selectedQuestion.id;
            delete selectedQuestion.answerOptions;
            addQuestion(kahootId, selectedQuestion)
                .then(response => {
                    setKahootBasics({ title: response.title, description: response.description });
                    setKahootDetail(response);
                    setQuestions(response?.questions?.length > 0 ? response.questions : [DEFAULT_QUESTION_STATE]);
                    enqueueSnackbar("Question Added", { variant: 'success' });
                })
                .catch(error => {
                    enqueueSnackbar(error.message, { variant: 'error' });
                });
        }
    };

    const handleQuestionDeletion = (index) => {
        const selectedQuestion = questions[index];
        let questionId = selectedQuestion.id;
        if (!questionId) {
            let questionList = [
                ...questions
            ];
            questionList.splice(index, 1);
            setQuestions(questionList?.length > 0 ? questionList : [DEFAULT_QUESTION_STATE]);
            enqueueSnackbar("Question Removed", { variant: 'success' });
        } else {
            if (!kahootDetail.id) {
                enqueueSnackbar("Draft a kahoot with title", { variant: 'error' });
                return;
            }
            const kahootId = kahootDetail.id;
            deleteQuestion(kahootId, questionId)
                .then(response => {
                    setKahootBasics({ title: response.title, description: response.description });
                    setKahootDetail(response);
                    setQuestions(response?.questions?.length > 0 ? response.questions : [DEFAULT_QUESTION_STATE]);
                    enqueueSnackbar("Question Removed", { variant: 'success' });
                })
                .catch(error => {
                    enqueueSnackbar(error.message, { variant: 'error' });
                });
        }
    }

    return (
        <Grid container className="kahoot_create_edit">
            <Grid item xs={12} sm={12} className="kahoot_create_edit_details">
                <div>
                    <Card className="kahoot_create_edit_details_section">
                        <TextField
                            className="kahoot_create_edit_details_section_title"
                            name="title"
                            fullWidth
                            placeholder="Title"
                            required
                            type="text"
                            variant="outlined"
                            value={kahootBasics.title}
                            onChange={handleKahootBasicsChange}
                        />
                        <TextField
                            className="kahoot_create_edit_details_section_title"
                            name="description"
                            fullWidth
                            placeholder="Description"
                            required
                            type="text"
                            variant="outlined"
                            value={kahootBasics.description}
                            onChange={handleKahootBasicsChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleKahootDraft}
                            className="kahoot_create_edit_details_section_button"
                        >Save</Button>
                    </Card>
                </div>
                {
                    questions && questions.length > 0 &&
                    questions.map((kah, index) =>
                        <Card className="kahoot_create_edit_details_questions" key={index}>
                            <CardContent>
                                <CreateOrUpdateKahoot
                                    id={index}
                                    question={kah}
                                    handleChange={handleChange}
                                    handleQuestionAddition={() => handleQuestionAddition(index)}
                                    handleQuestionSave={() => handleQuestionSave(index)}
                                    handleQuestionDeletion={() => handleQuestionDeletion(index)}
                                />
                            </CardContent>
                        </Card>
                    )
                }
            </Grid>
        </Grid>
    );
};

export default KahootCreateOrEdit;