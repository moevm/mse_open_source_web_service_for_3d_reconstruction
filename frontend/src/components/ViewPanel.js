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
import DbDispatcher from "../database/dbDispatcher";
import {server} from "../index";

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const recoverFileFromDataURI = (dataURI, name) => {
    let byteString = atob(dataURI.split(',')[1]);

    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new File([new Blob([ab], {type: mimeString})], name, {type: mimeString});
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
        //const storedImages = recoverImages() ?? [];
        this.state = {
            images: [],
            model: mesh,
            texture: colorMap,
            isMeshroomStarted: false,
            progressMessage: "Photos sent to server",
            progressValue: 10,
            isCropOpen: false,
            currentImage: null,
            offset: 0//defineOffset(storedImages)
        }
        this.progressHandler = null;
        this.dbDispatcher = new DbDispatcher();
    }

    componentDidMount() {
        this.dbDispatcher.getImages()
            .then((images) => {
                console.log(images);
                this.setState({
                    images: images,
                    offset: defineOffset(images)
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    componentWillUnmount() {
        if (this.progressHandler){
            clearInterval(this.progressHandler);
        }
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

    handleDelete = (id) => {
        this.dbDispatcher.deleteImage(id);
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
        this.dbDispatcher.updateImage(this.state.currentImage);
        //this.state.currentImage.file = new File([newImage], this.state.currentImage.name);
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
            let reader = new FileReader();
            reader.onloadend = () => {
                const image = {
                    src: reader.result,
                    name: file.name,
                    id: offset + idx
                };
                this.dbDispatcher.addImage(image);
                this.setState((prevState) => {
                    return {
                        images: prevState.images.concat(image)
                    };
                });
            }
            reader.readAsDataURL(file);
        });

        this.setState({
            offset: offset + Object.values(files).length
        })

        document.getElementById("raised-button-file").value = "";
    }

    loadImages = () => {
        const formData = new FormData();
        this.state.images.forEach((image) => {
            formData.append('images', recoverFileFromDataURI(image.src, image.name));
        });
        return formData;
    }

    handleStart = () => {
        //const progressHandlerInterval = 1000;
        //this.handleProgress(progressHandlerInterval);

        let requestUrl = server + 'upload/';
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': 'Bearer ' + store.getState().token
            }
        }

        axios.post(requestUrl, this.loadImages(), config)
            .then((response) => {
                console.log(response);

                let obj = new Blob([response.data['obj']] , {type: 'text/plain'});
                let png = recoverFileFromDataURI("data:image/png;base64," + response.data['png'], 'texture.png');

                let objUri = URL.createObjectURL(obj);
                let pngUri = URL.createObjectURL(png);

                console.log(pngUri);

                this.setState({
                    model:  objUri,
                    texture: pngUri
                });
                this.cancelProgress();

            })
            .catch((error) => {
                //this.cancelProgress();
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
                    <MeshroomProgress/>
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