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
            email: "",
            confirmedPassword: "",
            token: ""
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

    handleEmail = (event) => {
        this.setState({email: event.target.value});
    }

    storeLogin = () => {
        this.props.login({
            username: this.state.login,
            email: this.state.email,
            token: this.state.token
        });
    }

    isInputValid = () => {
        return !(this.state.login === "" || this.state.password.length < 8
            || this.state.confirmedPassword.length < 8 || !this.state.email.match(/.+@.+/));
    }

    signUp = () => {
        if (!this.isInputValid()){
            alert('Please, fill all fields! Password must contain at least 8 symbols.')
            return;
        }
        if (this.state.password !== this.state.confirmedPassword){
            alert('Passwords do not match!');
            return;
        }

        let requestUrl = 'http://localhost:8000/api/users/';
        let requestData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user": {
                    username: this.state.login,
                    email: this.state.email,
                    password: this.state.password
                }
            })
        }

        fetch(requestUrl, requestData).then(
            (response) => {
                return response.json();
            }
        ).then((response) => {
            if (response.errors === undefined){
                console.log(response);
                this.setState({token: response.user.token});
                this.storeLogin();
                console.log(this.state);
                this.setState({
                    redirect: true
                });
            }
        }).catch((err) => {
            console.log(err);
        });

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
                        <TextField onChange={this.handleLogin} fullWidth label="Login" margin="normal" variant="standard" > </TextField> <br/>
                        <TextField onChange={this.handleEmail} fullWidth label="E-mail" margin="normal" variant="standard" > </TextField> <br/>
                        <TextField onChange={this.handlePassword} fullWidth label="Password" margin="normal" type={'password'} variant="standard" > </TextField> <br/>
                        <TextField onChange={this.handleConfirmedPassword} fullWidth label="Confirm password" margin="normal" type={'password'} variant="standard" > </TextField>
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