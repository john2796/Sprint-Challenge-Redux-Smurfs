import React, { Component } from "react";
import "./App.css";
import MainNavBar from "./MainNavBar";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import {
  getSmurf,
  postSmurf,
  removeSmurf,
  submitUpdated
} from "../store/actions/smurfAction";
import SmurfLists from "./SmurfLists";
import SmurfForm from "./SmurfForm";
import SingleSmurf from "./SingleSmurf";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
      name: "",
      height: "",
      isUpdated: false
    };
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  componentDidMount() {
    this.props.getSmurf();
  }
  handleSubmit = e => {
    e.preventDefault();
    const { isUpdated } = this.state;
    if (isUpdated) {
      this.submitUpdatedSmurf();
    } else {
      this.addSmurf();
    }
    this.props.history.push("/");
    this.setState({
      age: "",
      name: "",
      height: "",
      isUpdated: false
    });
  };
  addSmurf = () => {
    const newSmurf = {
      age: this.state.age,
      name: this.state.name,
      height: this.state.height
    };
    this.props.postSmurf(newSmurf);
  };
  deleteSmurf = id => {
    this.props.removeSmurf(id);
    this.props.history.push("/");
  };
  submitUpdatedSmurf = () => {
    const updatedsmrf = {
      age: this.state.age,
      name: this.state.name,
      height: this.state.height
    };
    this.props.submitUpdated(this.state.id, updatedsmrf);
  };
  updateSmurf = smurf => {
    this.setState({
      age: smurf.age,
      height: smurf.height,
      name: smurf.name,
      id: smurf.id,
      isUpdated: true
    });
    this.props.history.push("/form");
  };

  cancelForm = () => {
    this.setState({
      age: "",
      name: "",
      height: "",
      isUpdated: false
    });
    this.props.history.push("/");
  };

  render() {
    const { smurf, loading, errors } = this.props;
    const { isUpdated } = this.state;

    return (
      <div className="App">
        <MainNavBar />
        {loading && (
          <img
            src="https://media1.tenor.com/images/72b72ff0c392a16c6b12e80bbe3473c5/tenor.gif?itemid=4989541"
            alt="loading"
          />
        )}
        {errors && <h1>{errors}</h1>}
        <Route
          path="/form"
          render={props => (
            <SmurfForm
              cancelForm={this.cancelForm}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              age={this.state.age}
              name={this.state.name}
              height={this.state.height}
              isUpdated={isUpdated}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/"
          render={props => <SmurfLists {...props} smurfs={smurf} />}
        />
        <Route
          exact
          path="/smurf/:id"
          render={props => (
            <SingleSmurf
              {...props}
              updateSmurf={this.updateSmurf}
              deleteSmurf={this.deleteSmurf}
            />
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  smurf: state.smurfReducer.smurf,
  loading: state.smurfReducer.loading,
  errors: state.smurfReducer.errors
});

export default connect(
  mapStateToProps,
  { getSmurf, postSmurf, removeSmurf, submitUpdated }
)(App);
