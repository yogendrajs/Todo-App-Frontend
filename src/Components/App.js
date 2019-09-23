import React, { Component } from 'react'
import Todolist from './Todolist';
import Addtodo from './Addtodo'
import Stats from './Stats';
import axios from 'axios';
import _ from 'underscore';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Redirect } from 'react-router-dom';
import { getJwt } from './helpers/jwt';

export default class App extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             item: '',
             editItem: '',
             list: [],
             isDone: 0,
             id: 'total',
             updateId: null,
             login: false,
        }
    }

    UNSAFE_componentWillMount(){
        if (!getJwt()){
            this.setState({
                login: true,
            })
            reactLocalStorage.remove('jwt', '');
        }

        // console.log(typeof(this.props.finaljwt));
        axios
            .get('http://localhost:4000/get', {params: {token: getJwt()}})
            .then(result => {
                // console.log('willmount', result.data);
                // console.log(result.data === 'token is not valid')
                if (result.data  === 'token is not valid'){
                    reactLocalStorage.remove('jwt');
                    this.setState({
                        login: false,
                    })
                }

                let data = result.data;
                let ticks = data.filter(issue => {
                    return issue.done === 1 || issue.done === true;
                })
                this.setState({
                    list:data,
                    isDone: ticks.length
                });
            })
            .catch(err => console.log(err));
    }

    componentDidUpdate(){
        // console.log('componentDidUpdate')
        axios
        .get('http://localhost:4000/get', {params: {token: getJwt()}})
        .then(result => {
            // console.log('willupdate', result);
            if (result.data === 'token is not valid'){
                reactLocalStorage.remove('jwt', '');
                this.setState({
                    login: true,
                })
            }
        })
        .catch(err => console.log(err));
    }

    addtodo = (e) => {
        // console.log(e.target.value)
        this.setState({item: e.target.value});
    }

    doubleClick = (itemId) => {
        // let dict = _.findWhere(this.state.list, {id: itemId});
        this.setState({
            updateId: itemId,
        })
    }

    editTodo = (e) => {
        // console.log(e.target.value);
        // console.log(this.state.updateId);
        this.setState({
            editItem: e.target.value,
        })
    }

    editSubmit = (e) => {
        if (e.key === 'Enter' || e.target.id === 'update'){
            e.preventDefault();
            let updateId = this.state.updateId;
            if (this.state.editItem.length !== 0){
                if (updateId !== null){
                    axios
                    .put('http://localhost:4000/update/' + updateId, {editItem: this.state.editItem, token: getJwt()})
                    .then(response => {
                        // console.log('updated!');
                        // console.log('response', response);
                        this.setState({list: response.data, updateId:null});
                    })
                    .catch(err => console.log(err));
                }
            }else this.setState({updateId:null});
        }
    }

    delete = (itemId) => {
        axios
        .delete('http://localhost:4000/delete/' + itemId, {data: {token: getJwt()}})
        .then((response) => {
            // console.log('response from delete', response);

            let doneList = response.data.filter(done => {
                return done.done === true || done.done === 1;
            })

            this.setState({
                list: response.data,
                isDone: doneList.length,
            })
        })
        .catch(err => console.log(err));
    }

    submitData = (e) => {
        // e.preventDefault();
        let {item, list} = this.state;
        if(e.key === 'Enter'){
            e.preventDefault();
            if (item.length > 0){
                list.push({
                    item: item,
                    done: false,
                });

                axios
                .post('http://localhost:4000/post', {itemArg: list[list.length-1], token: getJwt()})
                .then((fullUserData) => {
                    // console.log('data uploaded!', fullUserData);
                    this.setState({list: fullUserData.data});
                    // console.log('this is state', this.state.list);
                })
                .catch(err => console.log(err));
            }
            else {
                console.log('Kindly input some data');
            }


            this.setState({
                item: '',
                updateId: null,
            })
        }
    }

    checkboxHandler = (e) => {
        // console.log('this method is working now!',e.target);
        // this.setState({checked: e.target.checked});
        var {list, isDone} = this.state;
        var {id, checked} = e.target;

        console.log(id, checked);
        var obj = _.findWhere(list, {id: parseInt(id)})
        obj.done = checked; // to set checked if uncheck and vice-versa
        // console.log(obj);
        // console.log('this is obj.done', obj.done);

        axios
        .put('http://localhost:4000/checkbox', {done: obj.done, id: id, token: getJwt()})
        .then((response) => {
            // console.log('updated checkbox!');
            // console.log(response.data);
            this.setState({
                list: response.data,
            })
        })
        .catch(err => console.log('error updating value', err));

        let doneList = list.filter(done => {
            return done.done === true || done.done === 1;
        })
        // console.log(doneList);
        isDone = doneList.length;

        this.setState({list: list, isDone: isDone});
        // console.log(isDone);
    }

    dropdown = (e) => {
        // console.log(e.target.value)
        var id = e.target.value;
        this.setState({id: id});
    }

    logout = () => {
        // console.log('hello')
        this.setState({
            login:true
        })
    }
    
    render() {
        if (this.state.login){
            return <Redirect to='/login' />
        }

        return (
            <div>
                <Stats length={this.state.list.length} doneValue={this.state.isDone} dropdown={this.dropdown} logout={this.logout}/>
                <Addtodo addtodo={this.addtodo} submitData={this.submitData} updateData={this.updateData} value={this.state.item} length={this.state.list.length} />
                <Todolist id="update" updateId={this.state.updateId} list={this.state.list} checkbox={this.checkboxHandler} check={this.state.id} onDouble={this.doubleClick} editTodo={this.editTodo} editSubmit={this.editSubmit} delete={this.delete} />
            </div>
        )
    }
}
