import React from 'react'
import {Container, Typography} from "@mui/material";

class InfoTab extends React.Component {
    render(){
        return (
            <Container maxWidth={'xl'}>
                <Typography variant="h2" data-testid={'info-tab'} marginTop={1}>
                    Welcome to the open source web service for 3d reconstruction!
                </Typography>
                <Typography marginTop={1}>
                    Meshroom is a free, open-source 3D Reconstruction Software based on the AliceVision framework.
                    AliceVision is a Photogrammetric Computer Vision Framework which provides 3D Reconstruction and
                    Camera Tracking algorithms. AliceVision comes up with strong software basis and state-of-the-art
                    computer vision algorithms that can be tested, analyzed and reused. The project is a result of
                    collaboration between academia and industry to provide cutting-edge algorithms with the robustness
                    and the quality required for production usage.
                </Typography>
            </Container>
        );
    }
}

export default InfoTab;