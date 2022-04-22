import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'


class CropWindow extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            crop: null,
            completedCrop: null,
            aspect: null,
            currentImage: null
        }
        this.imageRef = React.createRef();
    }

    loadCroppedImage = () => {
        this.getCroppedImg(this.imageRef.current, this.state.completedCrop, 'cropped.png')
            .then((res) => {
                const blobUrl = URL.createObjectURL(res);
                this.setState({
                    currentImage: blobUrl
                })
                this.props.onClose(blobUrl);
            })
    }

    getCroppedImg = (image, pixelCrop, fileName) => {
        const canvas = document.createElement('canvas');
        //canvas.visible = "hidden";
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        const cx = image.naturalWidth / image.width
        const cy = image.naturalHeight / image.height;
        //image.scale(1 / cx, 1 / cy)

        ctx.drawImage(
            image,
            cx*pixelCrop.x,
            cy*pixelCrop.y,
            cx*pixelCrop.width,
            cy*pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(file => {
                file.name = fileName;
                resolve(file);
            }, 'image/png');
        });
    }

    downloadCroppedImage = () => {
        if (!this.state.currentImage) {
            this.getCroppedImg(this.imageRef.current, this.state.completedCrop, 'cropped.png')
                .then((res) => {
                    const blobUrl = URL.createObjectURL(res);
                    this.setState({
                        currentImage: blobUrl
                    })
                    let element = document.createElement("a");
                    element.href = this.state.currentImage;
                    element.download = "cropped.png";
                    element.click();
                })
        } else {
            let element = document.createElement("a");
            element.href = this.state.currentImage;
            element.download = "cropped.png";
            element.click();
        }
    }

    render(){
        return (
            <Dialog
                open={this.props.isOpen}
                //onClose={this.props.handleClose}
                aria-labelledby="crop-dialog-title"
                aria-describedby="crop-dialog-description"
            >
                <DialogTitle id="crop-dialog-title" data-testid={"crop-dialog-title"}>
                    {"Crop your photo:"}
                </DialogTitle>

                <DialogContent>
                    <ReactCrop
                        crop={this.state.crop}
                        onChange={(_, percentCrop) => {
                            this.setState({
                                crop: percentCrop
                            });
                        }}
                        onComplete={(c) => {
                            this.setState({
                                completedCrop: c
                            });
                            console.log(c);
                        }}
                        aspect={this.state.aspect}
                    >
                    <img
                        style={{
                            width: "100%"
                        }}
                        src={this.props.image}
                        ref={this.imageRef}
                        alt={'Can not load image'} />
                    </ReactCrop>
                </DialogContent>

                <DialogActions>
                    <Button data-testid={"crop-dialog-ok"} onClick={this.loadCroppedImage} >Ok</Button>
                    <Button data-testid={"crop-dialog-cancel"} onClick={this.downloadCroppedImage} >Download cropped</Button>
                    <Button data-testid={"crop-dialog-cancel"} onClick={() => {this.props.onClose(null)}} >Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default CropWindow;