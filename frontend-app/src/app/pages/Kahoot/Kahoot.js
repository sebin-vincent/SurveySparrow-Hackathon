import React from 'react';

import PageContainer from '../../components/PageContainer';
import KahootManage from '../../containers/KahootManage/KahootManage';

import './Kahoot.scss';

const Kahoot = () => {
    return (
        <PageContainer>
            <KahootManage />
        </PageContainer>
    );
};

export default Kahoot;