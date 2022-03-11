import React from 'react'
import {Button, Container, Link, Paper, TextField, Typography} from "@mui/material";
import axios from "axios";
import { Navigate } from "react-router-dom";

class SignInTab extends React.Component {
    constructor(props){
        super(props);
        this.state = { login: "", password: "", redirect: false};
        this.login = this.login.bind(this)
    }

    handleLogin = (event) => {
        this.setState({login: event.target.value});
    }

    handlePassword = (event) => {
        this.setState({password: event.target.value});
    }

    storeLogin = () => {
        this.props.login(this.state.login);
    }

    login(event){
        let name = this.state.login;
        let password = this.state.password;
        this.setState({redirect: true});
        this.storeLogin();
        /*axios({
            method: "POST",
            body: JSON.stringify({
                'name': name,
                'password': password
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

        /*fetch("http://localhost:8000/authorization/check/", {
            method: "POST",
            body: JSON.stringify({name: name,password: password})
        })
            .then(
                (result) => {
                    this.setState({
                        isAuth: result.text().then(text => text.toString())
                    });

                }
            )*/
    }

    componentWillUnmount() {
        this.setState({redirect: false});
    }

    /*smth(){
        if (this.state.isAuth === "True"){
            console.log("SignedIn")
        }else{
            console.log("NO")
        }
    }*/

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
                        <TextField onChange={this.handleLogin} value={this.state.login} fullWidth label="Login" margin="normal" variant="standard"> </TextField> <br/>
                        <TextField fullWidth label="Password" margin="normal" type={'password'} variant="standard"> </TextField> <br/>
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