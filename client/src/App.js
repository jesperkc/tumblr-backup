import React, { Component } from "react";

import Posts from "./Posts";
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
      <div className="App">
        <div className="ui text container">
          <Posts/>
        </div>
      </div>
    );
  }
}

export default App;
