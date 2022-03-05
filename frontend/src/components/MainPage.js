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
            <>
                <MainNavbar/>
                {this.defineContent()}
            </>)
    }
}

export default MainPage;