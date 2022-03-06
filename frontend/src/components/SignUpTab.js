import React from 'react'
import {Button, Container, Link, Paper, TextField, Typography} from "@mui/material";

class SignUpTab extends React.Component {
    render(){
        return (
            <Paper data-testid={'sign-up-tab'} elevation={6} sx={{
                p: 2,
                minWidth: 300,
                marginTop: 10
            }}>
                <form>
                    <Container>
                        <Typography variant={'h3'} align={'center'}> Sign up </Typography>
                        <Typography align={'center'}> Already have an account? Sign in <Link href={'/signin'}> here </Link> </Typography>
                        <TextField fullWidth label="Login" margin="normal" variant="standard"> </TextField> <br/>
                        <TextField fullWidth label="Password" margin="normal" type={'password'} variant="standard"> </TextField> <br/>
                        <TextField fullWidth label="Confirm password" margin="normal" type={'password'} variant="standard"> </TextField>
                        <Button variant="outlined" sx={{marginTop: 1}}> Sign up </Button>
                    </Container>
                </form>
            </Paper>
        );
    }
}

export default SignUpTab;