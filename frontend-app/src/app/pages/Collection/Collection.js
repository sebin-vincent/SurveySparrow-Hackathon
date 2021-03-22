import React from 'react';

import PageContainer from '../../components/PageContainer';
import CollectionManage from '../../containers/CollectionManage/CollectionManage';
import './Collection.scss';

const Collection = () => {
    return (
        <PageContainer>
            <CollectionManage />
        </PageContainer>
    );
};

export default Collection;