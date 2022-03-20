import React from 'react'
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";
import * as THREE from "three";
import { DDSLoader } from "three-stdlib";
import axios from "axios";

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const Scene = () => {
    const obj = useLoader(OBJLoader, '/Poimandres.obj')
    return <primitive object={obj} scale={0.4}/>
};

class ViewPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            photos: [],
            file: '',
            imagePreviewUrl: ''
        }
    }

    handleUpload = (event) => {
        let reader = new FileReader();
        let file = event.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
        /*const data = new FormData();
        data.append('file', event.target.files[0]);
        let requestUrl = 'http://localhost:8000/upload';
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        console.log(event.target.files);*/

        //axios.post(requestUrl, data, config)
        //    .then((response) => {
        //        this.setState({ photos: [response.data, ...this.state.photos] });
        //    })
        //    .catch((error) => {
        //        console.log(error);
        //    });
    }

    /*
    <Grid data-testid={'view-panel'} container spacing={2}>
                {this.state.photos.map(photo => (
                    <Grid item xl={4} xs={12}>
                        <img src={`http://localhost:3000/${photo.filename}`} alt={'user photo'} />
                    </Grid>
                ))}
    </Grid>
    */
    displayImage(){
        if (this.state.imagePreviewUrl){
            return (
                <Grid item xl={6} xs={12}>
                        <img style={{width: '100px', height: 'auto', marginTop: '1em', marginLeft: "1em"}} src={this.state.imagePreviewUrl} alt={'user photo'} />
                </Grid>
            )
        }
        return null;
    }

    render(){
        return (
            <>
            <Grid data-testid={'view-panel'} container spacing={2}>
                <Grid item xl={6} xs={12}>
                    <Typography variant={'h4'}> Please, choose your images: </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            height: 300,
                            border: '1px solid grey'
                        }}
                    >
                        {this.displayImage()}
                    </Box>

                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={this.handleUpload}
                    />

                </Grid>
                <Grid item xl={6} xs={12}>
                    <>
                        <Typography variant={'h4'}> 3D model will be displayed here: </Typography>
                        <Canvas style={{ maxHeight: 300}}>
                            <Suspense fallback={null}>
                                <Scene />
                                <OrbitControls />
                                <Environment preset="sunset" background />
                            </Suspense>
                        </Canvas>
                    </>
                </Grid>
            </Grid>
            <Container data-testid={'control-panel'} maxWidth={'xl'} sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginTop: 2,
                marginBottom: 2
            }}>
                <label htmlFor="raised-button-file">
                    <Button variant="raised" component="span" >
                        Upload
                    </Button>
                </label>
                <Button style={{marginLeft: '1em'}}> Start </Button>
            </Container>
            </>
        );
    }
}

export default ViewPanel;