import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import queryString from 'query-string';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';

export default class ResetPass extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            linkExpiry: false, 
            firstPass: '',
            secondPass: '',
            passwordReset: false,
        }
    }

    componentDidMount(){
        const value=queryString.parse(this.props.location.search);
        const token=value.key;
        axios.post('http://localhost:4000/resetpass', {token: token})
        .then(config => {
            if (config.data === false){
                swal("Link Error", "This Link is expired!", "error");
                this.setState({
                    linkExpiry: true,
                })
            }
        })
        .catch(err => console.log(err));
    }
    

    firstPass = (e) => {
        this.setState({
            firstPass: e.target.value,
        })
    }

    secondPass = (e) => {
        this.setState({
            secondPass: e.target.value,
        })
    }

    submitNew = (e) => {
        console.log('submitNew clicked!');
        e.preventDefault();
        const value=queryString.parse(this.props.location.search);
        const token=value.key;
        const { firstPass, secondPass } = this.state;

        if (firstPass === secondPass){
            const re = new RegExp("(?=.*?[0-9]).{8,}$");
            const isOk = re.test(firstPass);
            // console.log(isOk);
            if (!isOk){
                swal("Wait!", "Your Password should be at least 8 letter long with numbers", "info");
                this.setState({
                    firstPass: '',
                    secondPass: '',
                });
                return;
            }

            axios.post('http://localhost:4000/submitNewPass', {token: token, password: firstPass})
            .then(data => {
                if (data.data){
                    console.log('checkit');
                    this.setState({
                        firstPass: '',
                        secondPass: '',
                        passwordReset: true,
                    });
                    swal("Awesome!", "Your Password has been reset successfully!", "success")
                }
                else {
                    swal("Link Error", "This Link is expired!", "error");
                    this.setState({
                        linkExpiry: true,
                    })
                }
            })
            .catch(err => console.log(err));
        }else {
            this.setState({
                firstPass: '',
                secondPass: '',
            });

            swal("Wait!", "Your passwords don't match!", "info");
        }
    }

  render(){

    if (this.state.linkExpiry){
        return <Redirect to="/forgotpass" />
    }

    if (this.state.passwordReset){
        return <Redirect to="/login" />
    }

    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div style={{
                marginTop: '50px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
            >
            <Typography component="h1" variant="h5">
              Change Password
            </Typography>
            <form onSubmit={this.submitNew}>
            <TextField
                id="outlined-password-input"
                label="New Password"
                // className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                onChange={this.firstPass}
                variant="outlined"
                value={this.state.firstPass}
                fullWidth
                required
            />
            <TextField
                id="outlined-password-input2"
                label="Confirm Password"
                // className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                onChange={this.secondPass}
                variant="outlined"
                value={this.state.secondPass}
                fullWidth
                required
            />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                // className={classes.submit}
              >
                Submit
              </Button>
            </form>
          </div>
          <Box mt={8}>
            {/* <Copyright /> */}
          </Box>
        </Container>
      );
  }
}