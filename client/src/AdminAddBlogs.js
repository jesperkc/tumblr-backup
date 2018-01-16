// Was App.js
import React, { Component } from 'react';

class AdminAddBlogs extends Component {
  constructor(props) {
    super(props);
    this.state = {blogs: ''};

    // Toggle the state every second
    setInterval(() => {
      this.setState(previousState => {
        return { isShowingText: !previousState.isShowingText };
      });
    }, 1000);
  }

  handleChange(event) {
    this.setState({blogs: event.target.value});
  }

  addBlogs = async (event) => {
    event.preventDefault();
    console.log(this.state.blogs);

    const response = await fetch('/addblogs', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        blogs: this.state.blogs
      })
    });
    this.setState({blogs: ''});
    return response;
  };
  render() {
    return (
      <div>
        Add blogs
        <textarea value={this.state.blogs} onChange={this.handleChange.bind(this)}></textarea>
        <button onClick={this.addBlogs.bind(this)}></button>
      </div>
    );
  }
}

export default AdminAddBlogs;