import React from 'react'
import {Button, Container} from "@mui/material";

class ControlPanel extends React.Component {
    render() {
        return (
            <Container data-testid={'control-panel'} maxWidth={'xl'} sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 2,
                marginBottom: 2
            }}>
                <Button> Start </Button>
            </Container>
        );
    }
}

export default ControlPanel;