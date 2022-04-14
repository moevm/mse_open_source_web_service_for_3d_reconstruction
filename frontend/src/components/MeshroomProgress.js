import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import {Box, Typography} from "@mui/material";

class MeshroomProgress extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', ml: '1em'}}>
                <Box sx={{ width: '100%', mr: '1em' }}>
                    <LinearProgress variant="determinate" value={this.props.value} />
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary"> {this.props.message} </Typography>
                </Box>
            </Box>
        );
    }
}

export default MeshroomProgress;