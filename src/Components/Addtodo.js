import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'green',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'red',
        },
        '&:hover fieldset': {
          borderColor: 'yellow',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'green',
        },
      },
    },
  })(TextField);
  
  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
  }));
   

export default function Addtodo(props) {
    const classes = useStyles();
    return (
        <div>
            {/* <input type="text" onChange={props.addtodo} value={props.value} onKeyPress={props.submitData} placeholder="Add your todo"/><br></br> */}
            <form className={classes.root} noValidate>
                <CssTextField
                    onChange={props.addtodo}
                    className={classes.margin}
                    label="Add Todo"
                    value={props.value}
                    onKeyPress={props.submitData}
                    variant="outlined"
                    fullWidth
                    // autoFocus
                />
            </form>
            {/* <button onClick={props.submitData} id="submit" >Submit</button> */}
        </div>
    )
}