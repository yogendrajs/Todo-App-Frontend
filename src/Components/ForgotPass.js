import React from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import swal from 'sweetalert';
import { reactLocalStorage } from 'reactjs-localstorage';
import LoginPage from './LoginPage';

export default class ForgotPass extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
             email: null,
             checkJwt: false,
        }
    }

    componentDidMount() {
        let getJwt = reactLocalStorage.get('jwt');
        // console.log(getJwt);
        if (getJwt !== undefined) {
            this.setState({
                checkJwt: true,
            })
        }
    }

    emailChange = (e) => {
        this.setState({
            email: e.target.value,
        })
    }

  emailSubmit = (e) => {
      e.preventDefault()
    //   console.log(this.state.email);
      if (this.state.email !== null){
        axios
        .post('http://localhost:4000/forgot', {email: this.state.email})
        .then(data => {
            // console.log(data);
            if (data.data.length === 0){
                swal("Error", "This Email doesn't exist! Please Sign up!", "error");
            }
            else {
                swal("Awesome!", "A Password Reset link has been sent to your Email!", "success");
            }
        })
        .catch(err => console.log(err));
      }
      else {
        swal("Error", "Please enter your Email!", "error");
      }
  }
  render(){

    if (this.state.checkJwt){
        return <LoginPage />
    }
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Grid
                container
                // spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh'}}
            >
    
                <Grid item xs={10}>
                    <Card style={{ padding: '50px', marginLeft: 'auto' }}>
                        <form onSubmit={this.emailSubmit}>
                            <Typography variant="h6" >
                                Enter your email to Reset the Password
                            </Typography>
                                <TextField
                                    id="outlined-email-input"
                                    label="Email"
                                    onChange={this.emailChange}
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    margin="normal"
                                    variant="outlined"
                                    required
                                />
                                <br></br>
                            <Button style={{color: 'Blue', background: 'skyBlue'}} onClick={this.emailSubmit}>Submit</Button>
                        </form>
                    </Card>
                </Grid>      
            </Grid>
        </div>
        );
    }
}
