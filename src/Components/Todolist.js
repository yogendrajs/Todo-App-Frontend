import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { green, lightBlue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';

const theme = createMuiTheme({
    palette: {
      primary: green,
      background: {
          paper: lightBlue,
      }
    },
});

// console.log(theme.palette.background.paper['100'])
// console.log(lightBlue)
const useStyles = makeStyles({
  root: {
    width: '100%',
    // maxWidth: 360,
    // backgroundColor: theme.palette.background.paper['100'],
    backgroundColor: '#fffffff',
  },
  margin: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.paper['100'],
  }
});

export default function Todolist(props) {
  const classes = useStyles();

  var data = props.list.filter(newlist => {
        if (props.check === 'donelist') {
            return newlist.done === 1 || newlist.done === true;
        }else if (props.check === 'pendinglist') {
            return newlist.done === 0 || newlist.done === false;
        }else {
            return true;
        }
    })

  return (
    <List className={classes.root} >

      {data.map(value => {
        const labelId = String(value.id);
        var tick = value.done ? true: false;
        // console.log(tick);

        if (value.id === props.updateId){
            return <ListItem key={parseInt(labelId)} className={classes.margin} >
                        {/* <input type="checkbox" id={item.item} onChange={props.checkbox} checked={item.done} /> */}
                        <ListItemIcon>
                        <Checkbox 
                            onChange={props.checkbox}
                            id={(labelId)}
                            checked={tick}
                        />
                        </ListItemIcon>
                        {/* <input type="text" onChange={props.editTodo} defaultValue={value.item} onKeyPress={props.editSubmit} /> */}
                            <form className={classes.margin} noValidate>
                                <ThemeProvider theme={theme}>
                                    <TextField
                                      type="text"
                                      label="Edit Todo"
                                      defaultValue={value.item}
                                      onChange={props.editTodo}
                                      onKeyPress={props.editSubmit}
                                      fullWidth
                                    />
                                </ThemeProvider>
                            </form>
                        {/* <button onClick={props.editSubmit} id="update">Edit</button> */}
                    </ListItem>
        }
        else {
            return (
                <ListItem key={parseInt(labelId)} className={classes.margin} dense button onDoubleClick={() => props.onDouble(value.id)} >
                  <ListItemIcon>
                    <Checkbox 
                      onChange={props.checkbox}
                      id={(labelId)}
                      checked={tick}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.item} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => props.delete(labelId)} id="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            }
        }
    )}
    </List>
  );
}
