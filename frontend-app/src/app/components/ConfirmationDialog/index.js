import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import Button from '../Button/index';

import './ConfirmationDialog.scss';

const ConfirmationDialog = ({ isOpen, handleClose, maxWidth, title, content, submitProps, handleSubmit, cancelProps }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth={maxWidth}
            className="confirmation_dialog"
        >
            {
                title && <DialogTitle className="confirmation_dialog_title">{title}</DialogTitle>
            }
            <DialogContent className="confirmation_dialog_content">
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions className="confirmation_dialog_actions">
                <Button
                    color={cancelProps.color}
                    variant={cancelProps.variant}
                    onClick={handleClose}
                    shade={cancelProps.shade}
                >
                    {cancelProps.label}
                </Button>
                <Button
                    color={submitProps.color}
                    variant={submitProps.variant}
                    onClick={handleSubmit}
                    shade={submitProps.shade}
                >
                    {submitProps.label}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;