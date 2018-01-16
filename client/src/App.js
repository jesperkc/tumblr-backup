import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Posts from "./Posts";
import AdminAddBlogs from './AdminAddBlogs'
import "./style.css";

class App extends Component {
  state = {
    selectedFoods: []
  };

  removeFoodItem = itemIndex => {
    const filteredFoods = this.state.selectedFoods.filter(
      (item, idx) => itemIndex !== idx
    );
    this.setState({ selectedFoods: filteredFoods });
  };

  addFood = food => {
    const newFoods = this.state.selectedFoods.concat(food);
    this.setState({ selectedFoods: newFoods });
  };

  render() {
    const { selectedFoods } = this.state;

    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home!!</Link></li>
            <li><Link to="/AdminAddBlogs">Admin</Link></li>
          </ul>
    
          <hr/>
    
          <Route exact path="/" component={Posts}/>
          <Route path="/AdminAddBlogs" component={AdminAddBlogs}/>
        </div>
      </Router>
    );
  }
}

export default App;
