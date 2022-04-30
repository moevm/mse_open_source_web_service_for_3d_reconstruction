import React from 'react'
import {
    Button,
    Container,
    Grid,
    Typography
} from "@mui/material";
import "../styles/ViewPanel.css"
import { Canvas } from "@react-three/fiber";
import {Environment, OrbitControls, useTexture} from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import {DDSLoader} from "three-stdlib";
import axios from "axios";
import store from "../store/store";
import mesh from "../texturedMesh.obj"
import colorMap from "../texture_1001.png"
import MeshroomProgress from "./MeshroomProgress";
import CropWindow from "./CropWindow";
import Scene from "./Scene";
import ImagesDisplay from "./ImagesDisplay";

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const recoverImages = () => {
    try {
        const stateStr = sessionStorage.getItem('images');
        return stateStr ? JSON.parse(stateStr) : undefined;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

const saveImages = (images) => {
    try {
        sessionStorage.setItem('images', JSON.stringify(images));
    } catch (e) {
        console.error(e);
    }
}

const defineOffset = (images) => {
    if (!images || images.length === 0){
        return 0;
    }
    let maximum = 0;
    images.forEach((image) => {
        if (+image.id > maximum){
            maximum = +image.id;
        }
    });
    return maximum + 1;
}

class ViewPanel extends React.Component {
    constructor(props){
        super(props);
        const storedImages = recoverImages() ?? [];
        this.state = {
            images: storedImages,
            model: mesh,
            texture: colorMap,
            isMeshroomStarted: false,
            progressMessage: "Photos sent to server",
            progressValue: 10,
            isCropOpen: false,
            currentImage: null,
            offset: defineOffset(storedImages)
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

    handleDelete = (id) => {
        this.setState({
           images: this.state.images.filter((item) => {
               return item.id !== id;
           })
        });
    }

    handleCrop = (id) => {
        let image = this.state.images.filter((item) => {
            return item.id === id;
        });

        if (image.length === 0){
            return;
        }

        this.setState({
            isCropOpen: true,
            currentImage: image[0]
        });
    }

    handleCropClose = (newImage) => {
        this.setState({
            isCropOpen: false
        });

        if (!newImage){
            return;
        }

        this.state.currentImage.src = newImage;
        this.state.currentImage.file = new File([newImage], this.state.currentImage.name);
        let curImages = this.state.images;
        this.setState({
            images: curImages.map((item) => {
                if (item.id !== this.state.currentImage.id){
                    return item;
                }
                return this.state.currentImage;
            })
        })
    }

    handleUpload = (event) => {
        let files = event.target.files;
        let offset = this.state.offset;

        Object.values(files).forEach((file, idx) => {
            let image = {
                id: idx + offset,
                src: URL.createObjectURL(file),
                name: file.name,
                file: file
            }
            this.setState((prevState) => {
                return {
                    images: prevState.images.concat(image)
                };
            })
        })

        this.setState({
            offset: offset + Object.values(files).length
        })

        document.getElementById("raised-button-file").value = "";
    }

    loadImages = () => {
        console.log(this.state.images)
        const formData = new FormData();
        for (let image of this.state.images){
            formData.append('images', image.file);
        }
        return formData;
    }

    handleStart = () => {
        //const progressHandlerInterval = 1000;
        //this.handleProgress(progressHandlerInterval);

        let requestUrl = 'http://localhost:8000/upload/';
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': 'Bearer ' + store.getState().token
            }
        }

        axios.post(requestUrl, this.loadImages(), config)
            .then((response) => {
                console.log(response.data['png']);

                let obj = new Blob([response.data['obj']] , {type: 'text/plain'});
                let png = new Blob(["data:image/png;base64," + response.data['png']] , {type: 'image/png'});

                let objUri = URL.createObjectURL(obj);
                let pngUri = URL.createObjectURL(png);

                console.log(pngUri);

                this.setState({
                    model:  objUri
                    //texture: pngUri
                });
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

                    <ImagesDisplay
                        delete={this.handleDelete}
                        edit={this.handleCrop}
                        images={this.state.images}
                    />

                </Grid>
                <Grid item xl={6} md={6} xs={12}>
                    <MeshroomProgress />
                        {/*<Typography variant={'h4'}> 3D model will be displayed here: </Typography>
                        <Canvas style={{ maxHeight: '65vh'}}>
                            <Suspense fallback={null}>
                                <Scene model={this.state.model} texture={this.state.texture}/>
                                <OrbitControls />
                                <Environment preset="sunset" background />
                            </Suspense>
                        </Canvas>*/}
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
                <CropWindow
                    isOpen={this.state.isCropOpen}
                    onClose={this.handleCropClose}
                    image={this.state.currentImage?.src}
                />
            </>
        );
    }
}

export default ViewPanel;
export {saveImages};