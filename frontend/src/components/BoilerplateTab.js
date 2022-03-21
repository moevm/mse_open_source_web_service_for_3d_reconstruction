import React from 'react'
import ViewPanel from "./ViewPanel";
import ControlPanel from "./ControlPanel";
import {Container} from "@mui/material";

class BoilerplateTab extends React.Component {
    //<ControlPanel/>
    render(){
        return (
            <Container data-testid={'boilerplate-tab'} sx={{ marginTop: 4}}>
                <ViewPanel/>

            </Container>
        );
    }
}

export default BoilerplateTab;