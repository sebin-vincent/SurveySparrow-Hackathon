import React from 'react';
import { Box, Container } from '@material-ui/core';

import Navbar from '../Navbar/Navbar';
import './PageContainer.scss';

const PageContainer = ({ children }) => {
    return (
        <Box className="page_content">
            <Navbar />
            <main className="page_content_children">
                <Container>
                    {children}
                </Container>
            </main>
        </Box>
    );
};

export default PageContainer;