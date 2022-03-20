import React from 'react'
import {Box, Button, Grid, Typography} from "@mui/material";
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
            photos: []
        }
    }

    handleUpload = (event) => {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        let requestUrl = 'http://localhost:8000/upload';
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        console.log(event.target.files);

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
    render(){
        return (
            <Grid data-testid={'view-panel'} container spacing={2}>
                <Grid item xl={6} xs={12}>
                    <Typography variant={'h4'}> Please, choose your images: </Typography>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={this.handleUpload}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="raised" component="span" sx={{ marginLeft: '30%', marginTop: '10%' }}>
                            Upload
                        </Button>
                    </label>
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
        );
    }
}

export default ViewPanel;