import React, {useMemo} from 'react'
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
import store from "../store/store";
import mesh from "../texturedMesh.obj"
import map from "../texture_1001.png"
import {TextureLoader} from "three";
import MeshroomProgress from "./MeshroomProgress";

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const Scene = (props) => {
    const obj = useLoader(OBJLoader, props.model);
    const texture = useLoader(TextureLoader, props.texture);
    const geometry = useMemo(() => {
        let g;
        obj.traverse((c) => {
            if (c.type === "Mesh") {
                g = c.geometry;
            }
        });
        return g;
    }, [obj]);

    return (
        <mesh geometry={geometry} scale={1}>
            <meshPhysicalMaterial map={texture} />
        </mesh>
    );
    /*console.log(colorMap);

    return (
        <mesh>
            <primitive object={obj} scale={0.4}/>
            <meshStandardMaterial map={colorMap} />
        </mesh> );*/
};

class ViewPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [],
            model: mesh,
            texture: map,
            isMeshroomStarted: false,
            progressMessage: "Photos sent to server",
            progressValue: 10
        }
        this.progressHandler = null;
    }

    handleProgress = (interval) => {
        this.setState({isMeshroomStarted: true});
        this.progressHandler = setInterval(() => {
            let requestUrl = 'http://localhost:8000/state/';
            axios.get(requestUrl)
                .then((response) => {
                   this.setState({
                       progressMessage: response.message,
                       progressValue: +response.value
                   });
                }).catch((err) => {
                   console.log(err);
                });
        }, interval);
    }

    cancelProgress = () => {
        this.setState({isMeshroomStarted: false});
        clearInterval(this.progressHandler);
    }

    componentWillUnmount() {
        if (this.progressHandler){
            clearInterval(this.progressHandler);
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
                    name: file.name,
                    file: file
                });
                this.setState({
                    images: curImages
                });
            }
            reader.readAsDataURL(file);
        }
        document.getElementById("raised-button-file").value = "";
    }

    loadImages = () => {
        const formData = new FormData();
        for (let image of this.state.images){
            formData.append('images', image.file);
        }
        return formData;
    }

    handleStart = () => {
        //this.handleProgress(1000);

        let requestUrl = 'http://localhost:8000/upload/';
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': 'Bearer ' + store.getState().token
            }
        }

        axios.post(requestUrl, this.loadImages(), config)
            .then((response) => {
                let uri = URL.createObjectURL(new Blob([response.data] , {type:'text/plain'}))
                this.setState({ model:  uri});
                this.cancelProgress();
            })
            .catch((error) => {
                this.cancelProgress();
                console.log(error);
            });
    }

    render(){
        return (
            <>
            <Grid data-testid={'view-panel'} container spacing={2}>
                <Grid item xl={6} md={6} xs={12}>
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
                <Grid item xl={6} md={6} xs={12}>
                    <>
                        <Typography variant={'h4'}> 3D model will be displayed here: </Typography>
                        <Canvas style={{ maxHeight: '65vh'}}>
                            <Suspense fallback={null}>
                                <Scene model={this.state.model} texture={this.state.texture}/>
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
                <Button style={{marginLeft: '1em'}} onClick={this.handleStart} > Start </Button>
                { this.state.isMeshroomStarted && <MeshroomProgress
                    message={this.state.progressMessage}
                    value={this.state.progressValue}/> }
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
                items.push(
                    <Grid item xl={3} md={4} xs={6} >
                        <Card variant={'outlined'} sx={{
                            marginTop: '1em',
                            marginBottom: '1em',
                            marginLeft: '1em',
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
                                <IconButton  onClick={() => {return this.props.delete(image.name);}}>
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