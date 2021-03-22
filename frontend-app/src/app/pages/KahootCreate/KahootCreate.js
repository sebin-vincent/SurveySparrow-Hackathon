import React from 'react';

import PageContainer from '../../components/PageContainer';
import KahootCreateOrEdit from '../../containers/KahootCreateOrEdit/KahootCreateOrEdit';

import './KahootCreate.scss';

const KahootCreate = () => {
    return (
        <PageContainer>
            <KahootCreateOrEdit />
        </PageContainer>
    );
};

export default KahootCreate;