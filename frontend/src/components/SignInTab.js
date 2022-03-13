import React from 'react'
import {Button, Container, Link, Paper, TextField, Typography} from "@mui/material";
import axios from "axios";
import { Navigate } from "react-router-dom";

class SignInTab extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login: "",
            password: "",
            email: "",
            redirect: false,
            token: ""
        };
        this.login = this.login.bind(this)
    }

    handleLogin = (event) => {
        this.setState({login: event.target.value});
    }

    handlePassword = (event) => {
        this.setState({password: event.target.value});
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
        return !(this.state.login === "" || this.state.password.length < 8 || !this.state.email.match(/.+@.+/));
    }

    login(){
        if (!this.isInputValid()){
            alert('Please, fill all fields! Password must contain at least 8 symbols.')
            return;
        }

        let requestUrl = 'http://localhost:8000/api/users/login/';

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

    componentWillUnmount() {
        this.setState({redirect: false});
    }

    render(){
        return (
            <Paper data-testid={'sign-in-tab'} elevation={6} sx={{
                p: 2,
                minWidth: 300,
                marginTop: 10
            }}>
                <form>
                    <Container>
                        <Typography variant={'h3'} align={'center'}> Sign in </Typography>
                        <Typography align={'center'}> Do not have an account? Sign up <Link href={'/signup'}> here </Link> </Typography>
                        <TextField onChange={this.handleLogin} value={this.state.login} fullWidth label={'Login'} margin="normal" variant="standard" > </TextField> <br/>
                        <TextField onChange={this.handleEmail} value={this.state.email} fullWidth label={'E-mail'} margin="normal" variant="standard" > </TextField> <br/>
                        <TextField onChange={this.handlePassword} fullWidth label="Password" margin="normal" type={'password'} variant="standard" > </TextField> <br/>
                        <Button onClick={this.login} variant="outlined" sx={{marginTop: 1}}> Sign in </Button>
                    </Container>
                </form>
                {
                    this.state.redirect && <Navigate to='/main/authorized' replace={true} />
                }
            </Paper>
        );
    }
}

export default SignInTab;