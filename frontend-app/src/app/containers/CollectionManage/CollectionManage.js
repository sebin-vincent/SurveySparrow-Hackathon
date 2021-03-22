import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import Button from '../../components/Button/index';
import ExpandedCard from '../../components/ExpandedCard';
import CollectionCreateOrUpdate from '../../components/CollectionCreateOrUpdate/index';
import { createCollection, deleteCollection, getAllCollections, updateCollection } from '../../../api/service/Collection.service';
import ConfirmationDialog from '../../components/ConfirmationDialog';

import './CollectionManage.scss';

const CollectionManage = () => {
    const [collections, setCollections] = useState();
    const [openCreateCollection, setOpenCreateCollection] = useState(false);
    const [createOrUpdateRequest, setCreateOrUpdateRequest] = useState({ "title": "", "description": "" });
    const [openDeleteCollection, setOpenDeleteCollection] = useState(false);
    const [collectionInfo, setCollectionInfo] = useState({ "title": "", "id": "" });
    const [openUpdateCollection, setOpenUpdateCollection] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        getCollections.current();
    }, []);

    const getCollections = useRef(() => { });
    getCollections.current = () => {
        getAllCollections()
            .then(response => {
                setCollections(response);
            })
            .catch(error => {
                enqueueSnackbar(JSON.stringify(error), { variant: 'error' });
            });
    };

    const handleOpenCreateCollection = () => {
        resetCreateOrUpdateRequest();
        setOpenCreateCollection(open => !open);
    };

    const handleCreateOrUpdateCollectionValues = (e) => {
        const request = {
            ...createOrUpdateRequest,
            [e.target.name]: e.target.value,
        };
        setCreateOrUpdateRequest(request);
    };

    const resetCreateOrUpdateRequest = () => {
        setCreateOrUpdateRequest({ "title": "", "description": "" });
    };

    const validateCollectionRequest = (request) => {
        let isValid = true;
        if (!request.title) {
            isValid = false;
            enqueueSnackbar("Title is required", { variant: 'warning' })
        }
        return isValid;
    };

    const handleCreateCollection = () => {
        const isValid = validateCollectionRequest(createOrUpdateRequest);
        if (!isValid) {
            return;
        }
        createCollection(createOrUpdateRequest)
            .then(response => {
                enqueueSnackbar("Collection created", { variant: 'success' });
                resetCreateOrUpdateRequest();
                handleOpenCreateCollection();
                getCollections.current();
            })
            .catch(error => {
                enqueueSnackbar(JSON.stringify(error.message), { variant: 'error' });
            });
    };

    const handleUpdateCollection = () => {
        const isValid = validateCollectionRequest(createOrUpdateRequest);
        if (!isValid) {
            return;
        }
        updateCollection(createOrUpdateRequest.id, { title: createOrUpdateRequest.title, description: createOrUpdateRequest.description })
            .then(response => {
                enqueueSnackbar("Collection updated", { variant: 'success' });
                resetCreateOrUpdateRequest();
                handleOpenUpdateCollection();
                getCollections.current();
            })
            .catch(error => {
                enqueueSnackbar(JSON.stringify(error.message), { variant: 'error' });
            });
    };

    const handleOpenUpdateCollection = () => {
        if (openUpdateCollection) {
            resetCreateOrUpdateRequest();
        }
        setOpenUpdateCollection(open => !open);
    };

    const handleEditCollection = (collection) => {
        const request = {
            id: collection.id,
            title: collection.title,
            description: collection.description,
        };
        setCreateOrUpdateRequest(request);
        handleOpenUpdateCollection();
    };

    const handleOpenDeleteCollection = () => {
        setOpenDeleteCollection(open => !open);
    };

    const handleDeleteCollectionDialog = (collectionObject) => {
        handleOpenDeleteCollection();
        let collection = {
            ...collectionInfo,
            id: collectionObject.id,
            title: collectionObject.title,
        }
        setCollectionInfo(collection);
    };

    const handleDeleteCollection = () => {
        deleteCollection(collectionInfo.id)
            .then(response => {
                enqueueSnackbar("Collection deleted", { variant: 'success' });
                handleOpenDeleteCollection();
                setCollectionInfo({ "title": "", "id": "" });
                getCollections.current();
            })
            .catch(error => {
                enqueueSnackbar(JSON.stringify(error.message), { variant: 'error' });
            });
    };

    return (
        <>
            <Box className="collection_manage">
                <div className="collection_manage_header">
                    <Typography variant="h5" className="collection_manage_header_title">Collections</Typography>
                    <Button variant="contained" color="primary" size="large" onClick={handleOpenCreateCollection}>Create</Button>
                </div>
                <Grid container className="collection_manage_body" spacing={1}>
                    {
                        (collections && collections.length > 0) ?
                            collections.map(collection =>
                                <Grid item xs={12} sm={3} key={collection.id}>
                                    <ExpandedCard
                                        id={collection.id}
                                        title={collection.title}
                                        subTitle={collections.length === 1 ? '1 Kahoot' : `${collection.kahootsCount} Kahoots`}
                                        collection={collection}
                                        actionButtons={[
                                            { "name": "Edit", "action": handleEditCollection, "shade": "blue" },
                                            { "name": "Delete", "action": handleDeleteCollectionDialog, "shade": "red" },
                                        ]}
                                    />
                                </Grid>

                            ) :
                            <Typography variant="subtitle1">No collections found!!!</Typography>
                    }
                </Grid>
            </Box>
            <CollectionCreateOrUpdate
                open={openCreateCollection}
                onClose={handleOpenCreateCollection}
                handleChange={handleCreateOrUpdateCollectionValues}
                values={createOrUpdateRequest}
                handleCreateOrUpdateCollection={handleCreateCollection}
            />
            <ConfirmationDialog
                isOpen={openDeleteCollection}
                handleClose={handleOpenDeleteCollection}
                maxWidth="sm"
                title="Delete Collection"
                content={`Are you sure you want to delete "${collectionInfo.title}"? This collection will no longer be available, but you can still access the kahoots.`}
                submitProps={{ label: 'Delete', variant: 'contained', shade: 'red' }}
                handleSubmit={handleDeleteCollection}
                cancelProps={{ label: 'Cancel', variant: 'contained' }}
            />
            <CollectionCreateOrUpdate
                isUpdate={true}
                open={openUpdateCollection}
                onClose={handleOpenUpdateCollection}
                handleChange={handleCreateOrUpdateCollectionValues}
                values={createOrUpdateRequest}
                handleCreateOrUpdateCollection={handleUpdateCollection}
            />
        </>
    );
};

export default CollectionManage;