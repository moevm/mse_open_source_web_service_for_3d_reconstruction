import React from 'react'
import {Container, Typography} from "@mui/material";
import SignUpTab from "./SignUpTab";
import SignInTab from "./SignInTab";

class AuthPage extends React.Component {
    chooseComponent(mode) {
        if (mode === 'signin') {
            return <SignInTab/>;
        }
        return <SignUpTab/>;
    }

    render() {
        return (
            <Container maxWidth={'sm'} data-testid={'auth-page'}>
                {this.chooseComponent(this.props.mode)}
            </Container>
        )
    }
}

export default AuthPage;