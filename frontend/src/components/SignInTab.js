import React from 'react'
import {Button, Container, Link, Paper, TextField, Typography} from "@mui/material";

class SignInTab extends React.Component {
    render(){
        return (
            <Paper elevation={6} sx={{
                p: 2,
                minWidth: 300,
                marginTop: 10
            }}>
                <form>
                    <Container>
                        <Typography variant={'h3'} align={'center'}> Sign in </Typography>
                        <Typography align={'center'}> Do not have an account? Sign up <Link href={'/signup'}> here </Link> </Typography>
                        <TextField fullWidth label="Login" margin="normal" variant="standard"> </TextField> <br/>
                        <TextField fullWidth label="Password" margin="normal" type={'password'} variant="standard"> </TextField> <br/>
                        <Button variant="outlined" sx={{marginTop: 1}}> Sign in </Button>
                    </Container>
                </form>
            </Paper>
        );
    }
}

export default SignInTab;