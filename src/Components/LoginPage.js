import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import swal from 'sweetalert';
import { GoogleLogin } from 'react-google-login';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import { getJwt } from './helpers/jwt';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default class LoginPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             email: '',
             password: '',
             jwt: null,
             isLoggedIn: false,
        }
    }
    
    userEmail = (e) => {
        // console.log(e.target.value);
        this.setState({
            email: e.target.value,
        })
    }

    userPass = (e) => {
        // console.log(e.target.value);
        this.setState({
            password: e.target.value,
        })
    }
    
    submitData = (e) => {
        e.preventDefault();
        localStorage.clear(); // to clear the localStorage
        // let {email, password} = this.state;
        // console.log(email, password, this.state);

        axios
        .post('http://localhost:4000/login', (this.state))
        .then((config) => {
            // console.log( 'power', config.data);
            if (config.data.length === 0){
                swal("Login Error", "Please enter a valid Email/Password or Sign up!", "error");                
            }
            else {
                reactLocalStorage.set('jwt', config.data[0].token);
                this.setState({
                    isLoggedIn: true
                });
            }
        })
        .catch(err => console.log('yeh', err));
    }

    responseGoogle = (response) => {
        // console.log(response.tokenObj.id_token);
        // let token = response.tokenObj.id_token;
        // console.log(typeof(token));
        // console.log(response);
        
        axios
        .post('http://localhost:4000/googleSignIn', { tokenObj: response.tokenObj, imgUrl: response.profileObj.imageUrl })
        .then(config => {
            // console.log('config', config.data);
            if (config.data.length === 0){
                swal("Login Error", "Please enter a valid Email/Password or Sign up!", "error");                
            }
            else {
                // console.log(config.data[0])
                reactLocalStorage.set('jwt', config.data[0].token);
                this.setState({
                    isLoggedIn: true
                });
            }
        })
        .catch(err => console.log(err));
    }

    render(){
        if (this.state.isLoggedIn){
            return <Redirect to='/app' />
        }
        if (getJwt()){
            return <Redirect to='/app' />
        }
        return (
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div >
                <Avatar >
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form onSubmit={this.submitData} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        value={this.state.email} 
                        onChange={this.userEmail}
                        label="Email Address"
                        autoComplete="email"
                        type="email"
                        // autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        value={this.state.password} 
                        onChange={this.userPass}
                        // name="password"
                        label="Password"
                        type="password"
                        id="password"
                        // autoFocus
                        // autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        // className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        <RouterLink to="/forgotpass" variant="body2">
                            Forgot password?
                        </RouterLink>
                        </Grid>
                        <Grid item>
                            <RouterLink to="/signup" >
                                {"Don't have an account? Sign Up"}
                            </RouterLink>
                        </Grid>
                    </Grid>
                </form>
            </div>

            <GoogleLogin
                clientId="<Your Google Client_ID>"
                buttonText="Login With Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
            />

            <Box mt={2}>
                <Copyright />
            </Box>

            </Container>
        );
    }
}