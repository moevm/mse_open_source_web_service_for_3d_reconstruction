import React from 'react'
import {Button, Container, Link, Paper, TextField, Typography} from "@mui/material";
import axios from "axios";
import {Navigate} from "react-router-dom";

class SignUpTab extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            login: "",
            password: "",
            confirmedPassword: ""
        };
    }

    componentWillUnmount() {
        this.setState({redirect: false});
    }

    handleLogin = (event) => {
        this.setState({login: event.target.value});
    }

    handlePassword = (event) => {
        this.setState({password: event.target.value});
    }

    handleConfirmedPassword = (event) => {
        this.setState({confirmedPassword: event.target.value});
    }

    storeLogin = () => {
        this.props.login(this.state.login);
    }

    signUp = () => {
        if (this.state.password !== this.state.confirmedPassword){
            alert('Passwords do not match!');
            return;
        }
        this.setState({redirect: true});
        this.storeLogin();
        /*axios({
            method: "POST",
            body: JSON.stringify({
                'name': this.state.login,
                'password': this.state.password
            })
        }).then((response) => {
            this.setState({
                redirect: Boolean(response.text())
            });
            if (this.state.redirect === true){
                this.storeLogin();
            }
        }).catch((err) => {
            console.log(err);
        });*/
    }

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
                        <TextField onChange={this.handleLogin} fullWidth label="Login" margin="normal" variant="standard"> </TextField> <br/>
                        <TextField onChange={this.handlePassword} fullWidth label="Password" margin="normal" type={'password'} variant="standard"> </TextField> <br/>
                        <TextField onChange={this.handleConfirmedPassword} fullWidth label="Confirm password" margin="normal" type={'password'} variant="standard"> </TextField>
                        <Button onClick={this.signUp} variant="outlined" sx={{marginTop: 1}}> Sign up </Button>
                    </Container>
                </form>
                {
                    this.state.redirect && <Navigate to='/main/authorized' replace={true} />
                }
            </Paper>
        );
    }
}

export default SignUpTab;