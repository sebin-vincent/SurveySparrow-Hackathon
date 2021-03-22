import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core';

import TextField from '../TextField/index';
import Button from '../Button/index';

import './CollectionCreateOrUpdate.scss';

const CollectionCreateOrUpdate = ({ isUpdate, open, onClose, values, handleChange, handleCreateOrUpdateCollection }) => {
    return (
        <Dialog
            maxWidth="sm"
            fullWidth
            open={open}
            onClose={onClose}
            className="collection_create"
        >
            <DialogTitle className="collection_create_title">{isUpdate ? 'Update Collection' : 'Create Collection'}</DialogTitle>
            <DialogContent className="collection_create_content">
                <Grid container spacing={2}>
                    <Grid item sm={12} xs={12}>
                        <TextField
                            name="title"
                            label="Title"
                            required
                            fullWidth
                            type="text"
                            value={values.title}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <TextField
                            name="description"
                            label="Description"
                            fullWidth
                            type="text"
                            value={values.description}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            rowsMax={4}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="collection_create_action_center" >
                <Button color='default' variant="contained" onClick={onClose}>CANCEL</Button>
                <Button color="primary" variant="contained" onClick={handleCreateOrUpdateCollection}>{isUpdate ? 'Update' : 'Create'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CollectionCreateOrUpdate;