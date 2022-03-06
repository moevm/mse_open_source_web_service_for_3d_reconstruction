import React from 'react'
import {Box, Button, Grid, Typography} from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";
import * as THREE from "three";
import { DDSLoader } from "three-stdlib";

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const Scene = () => {
    const obj = useLoader(OBJLoader, '/Poimandres.obj')
    return <primitive object={obj} scale={0.4}/>
};

class ViewPanel extends React.Component {
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