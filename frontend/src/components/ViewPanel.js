import React from 'react'
import {
    Box,
    Button,
    Card,
    CardActionArea, CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid, IconButton,
    Paper,
    Typography
} from "@mui/material";
import "../styles/ViewPanel.css"
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";
import * as THREE from "three";
import { DDSLoader } from "three-stdlib";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
            images: [],
        }
    }

    handleDelete = (name) => {
        this.setState({
           images: this.state.images.filter((item) => {
               return item.name !== name;
           })
        });
    }

    handleUpload = (event) => {
        let files = event.target.files;
        for (let file of files){
            let reader = new FileReader();
            reader.onloadend = () => {
                let curImages = this.state.images;
                curImages.push({
                    src: reader.result,
                    name: file.name
                });
                this.setState({
                    images: curImages
                });
            }
            reader.readAsDataURL(file);
        }

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

    render(){
        return (
            <>
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

                    <ImagesDisplay delete={this.handleDelete} images={this.state.images}/>

                </Grid>
                <Grid item xl={6} xs={12}>
                    <>
                        <Typography variant={'h4'}> 3D model will be displayed here: </Typography>
                        <Canvas style={{ maxHeight: '65vh'}}>
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

class ImagesDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    displayImages(images){
        if (images.length > 0){
            let items = [];
            for (let image of images){
                //console.log(image);
                items.push(
                    <Grid item xl={3} xs={6} >
                        <Card variant={'outlined'} sx={{
                            marginTop: '1em',
                            marginBottom: '1em',
                            marginLeft: '1em',
                            //display: 'inline-block'
                        }}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    image={image.src}
                                    width={'100%'}
                                    alt={'user photo'}
                                />
                                <CardContent>
                                    <Typography color="text.secondary"> {image.name} </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions >
                                <IconButton  onClick={() => {this.props.delete(image.name);}}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton >
                                    <EditIcon/>
                                </IconButton>

                            </CardActions>
                        </Card>
                    </Grid>

                );
            }
            return (
                <Grid container align-items={'stretch'}>
                    {items}
                </Grid>
            );
        }
        return null;
    }

    render(){
        return (
            <Paper elevation={6}>
            <Box id={'images-panel'}
                sx={{
                    width: '100%',
                    height: '65vh',
                    overflow: 'auto'
                }}
            >

                    {this.displayImages(this.props.images)}

            </Box>
            </Paper>
        );
    }
}

export default ViewPanel;