import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { reactLocalStorage } from 'reactjs-localstorage';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class RecipeReviewCard extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
             avatar: null,
             name: null,
             email: null,
             imgUrl: null,
             checkProfile: false,
        }
    }
    
    componentDidMount(){
        let jwt = reactLocalStorage.get('jwt');
        if (!jwt){
            this.setState({
                checkProfile: true,
            })
            return;
        }
        axios
        .post('/profile', {token: jwt})
        .then(data => {
            let mainData = data.data;
            this.setState({
                avatar: mainData.avatar, // have not used yet
                name: mainData.name,
                email: mainData.email,
                imgUrl: mainData.imgUrl,
            })
        })
        .catch(err => console.log(err));
    }

    render(){
        if (this.state.checkProfile){
            return <Redirect to="/login" />
        }
        return (

            <Grid
                container
                // spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
                >
    
                <Grid item xs={12}>
                    <Card style={{maxWidth: 305}}>
                        <CardHeader
                            avatar={
                            <Avatar alt="Profile Picture" src={this.state.imgUrl} />
                            }
                            title={this.state.name}
                            subheader= {new Date().toDateString()}
                        />
                        <CardMedia
                            // style={{height: 0, paddingTop: '56.25%'}}
                            image={this.state.imgUrl}
                            title="Paella dish"
                            src={this.state.imgUrl}
                        />
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" component="p">
                            Email <br></br>
                            </Typography>
                            {this.state.email}
                        </CardContent>
                    </Card>
                </Grid>      
            </Grid>
        
      );
    }
}
