import React from 'react'
import {Box, Button, Grid, Typography} from "@mui/material";
import { GLTFModel, AmbientLight, DirectionLight } from "react-3d-viewer";

class ViewPanel extends React.Component {
    render(){
        return (
            <Grid container spacing={2}>
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
                        <GLTFModel
                            height={window.innerHeight / 2 /* + AND - AS DESIRED*/}
                            //width={window.innerWidth /* + AND - AS DESIRED*/}
                            // src="./src/lib/model/DamagedHelmet.gltf"
                            src="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf"
                        >
                            <AmbientLight color={0xffffff} />
                            <DirectionLight
                                color={0xffffff}
                                position={{ x: 100, y: 200, z: 100 }}
                            />
                            <DirectionLight
                                color={0xff00ff}
                                position={{ x: -500, y: 200, z: -100 }}
                            />
                        </GLTFModel>
                    </>
                </Grid>
            </Grid>
        );
    }
}

export default ViewPanel;