import React from 'react'
import {AppBar, Button, Container, createTheme, IconButton, ThemeProvider, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

class MainNavbar extends React.Component {
    createAppBar() {
        return (
            <Container data-testid={'main-navbar'} maxWidth={'xl'} sx={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <Toolbar>
                    <Button href={'/signin'} color={'success'} > Sign In </Button>
                    <Button href={'/signup'}> Sign Up </Button>
                </Toolbar>
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