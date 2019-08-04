import React, { Component } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default class CreateNote extends Component {

    state = {
        users: [],
        userSelected: '',
        title: '',
        content: '',
        date: new Date(),
        editing: false,
        _id: '',
    }

    async componentDidMount () {
        const res = await axios.get('http://localhost:4000/api/v1/users');
        this.setState({
            users: res.data.map(user => user.username),
            userSelected: res.data[0].username
        })
        if (this.props.match.params.id){
            const res = await axios.get('http://localhost:4000/api/v1/notes/' + this.props.match.params.id)
            
            this.setState({
                title: res.data.title,
                content: res.data.content,
                userSelected: res.data.author,
                date: new Date(res.data.date),
                editing: true,
                _id: this.props.match.params.id
            })
        }
    }

    onsubmit = async (e) => {
        e.preventDefault();
        const newNote = {
            title: this.state.title,
            content: this.state.content,
            date: this.state.date,
            author: this.state.userSelected,
        }
        if (this.state.editing) {
            await axios.put('http://localhost:4000/api/v1/notes/' + this.state._id, newNote)
        }else{
            await axios.post('http://localhost:4000/api/v1/notes', newNote)
        }
        this.props.history.push('/')
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onChangeDate = (date) => {
        this.setState({
            date
        })
    }

    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    <h4>Create a Note</h4>
                    
                    {/* SELECT USER  */}
                    <div className="form-group">
                        <select 
                            name="userSelected" 
                            className="form-control"
                            onChange={this.onInputChange}
                            value={this.state.userSelected}
                        >
                            {
                                this.state.users.map((user) => (
                                    <option key={user} value={user}>
                                        {user}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Title" 
                            name="title"
                            onChange={this.onInputChange}
                            value={this.state.title}
                        />
                    </div>

                    <div className="form-group">
                        <textarea 
                            name="content" 
                            id="" 
                            cols="30" 
                            rows="10"
                            className="form-control"
                            placeholder="Content"
                            required
                            onChange={this.onInputChange}
                            value={this.state.content}
                        >
                        </textarea>
                    </div>

                    <div className="form-group">
                        <DatePicker 
                            className="form-control"
                            selected={this.state.date}
                            onChange={this.onChangeDate}
                        />
                    </div>

                    <form onSubmit={this.onsubmit}>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}
