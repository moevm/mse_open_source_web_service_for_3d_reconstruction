import React from 'react'
import {AppBar, Button, Container, createTheme, IconButton, ThemeProvider, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import store from "../store/store";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

class MainNavbar extends React.Component {
    constructor(props){
        super(props);
    }

    isLogged(mode){
        if (mode === 'action'){
            console.log(store.getState())
            return (
                <Toolbar>
                    <span style={{ marginRight: '1em'}}> Signed as: {store.getState().login} </span>
                    <Button href={'/signup'} color={'error'}> Sign out </Button>
                </Toolbar>
            )
        }
        return (
            <Toolbar>
                <Button href={'/signin'} color={'success'} > Sign In </Button>
                <Button href={'/signup'}> Sign Up </Button>
            </Toolbar>
        )
    }

    createAppBar() {
        return (
            <Container data-testid={'main-navbar'} maxWidth={'xl'} sx={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                {this.isLogged(this.props.display)}
            </Container>
        );
    }

    render(){
        return (
            <ThemeProvider theme={darkTheme}>
                <AppBar position="static" color="primary">
                    {this.createAppBar()}
                </AppBar>

            </ThemeProvider>
        );
    }
}

export default MainNavbar;