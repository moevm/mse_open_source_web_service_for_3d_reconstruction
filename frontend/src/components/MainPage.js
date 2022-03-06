import React from 'react'
import {Typography} from "@mui/material";
import MainNavbar from "./MainNavbar";
import InfoTab from "./InfoTab";
import BoilerplateTab from "./BoilerplateTab";

class MainPage extends React.Component {

    defineContent(){
        if (this.props.display === 'action'){
            return <BoilerplateTab/>;
        }
        return <InfoTab/>;
    }

    render() {
        return (
            <div data-testid={'main-page'}>
                <MainNavbar/>
                {this.defineContent()}
            </div>)
    }
}

export default MainPage;