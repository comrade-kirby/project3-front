import React, { Component } from 'react';
import Post from '../Post/Post.js';
import Show from '../Show/Show.js';
import Add from '../Add/Add.js';
import Edit from '../Edit/Edit.js';
// import Materialize from 'materialize-css'
// import { Navbar, Nav, NavItem, NavDropdown, MenuItem  } from 'react-bootstrap';
import './App.css';

import axios from "axios";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from "react-router-dom"


class App extends Component {
  constructor(props) {
    super (props)
    // current date
    var today = new Date()
    // converting the date format to month and date
    var m_names = new Array("Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec");

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var date =  m_names[curr_month] + ' ' + curr_date;
    this.state = {
        posts: [],
        weather:"Sunny",
        temperature: "0",
        date: date
  }
}

  componentWillMount () {
    axios.get("https://api.wunderground.com/api/e99e675866a9f62a/conditions/q/DC/Washington.json")
    .then(response=>{
        this.setState({
          weather: response.data.current_observation.icon_url,
          temperature :response.data.current_observation.temp_f
        })
    })

    axios.get("http://localhost:4000/")
    .then(response => {
      this.setState({
      posts: response.data,
      })
    })
    .catch((err) => {
        console.log(err)
      })
  }

  handleSearchTag (e) {
    this.setState ({
    searchTag: e.target.value
    })
  }

  handleSearchSubmit (e) {
    console.log(this.state.posts)
    e.preventDefault ()
      axios.get(`http://localhost:4000/tags/${this.state.searchTag}`)
      .then(response => {
        this.setState({
          tags:response.data
        })
        var filtered=[];

        for (var i = 0; i < response.data.length; i++) {
            filtered.push(this.state.posts.filter((e) => e._id === response.data[i].post));
           }
          //  storing the results to an empty array (from an array within an array)
          let newFiltered = [].concat.apply([], filtered)

           console.log(filtered)
           console.log(newFiltered)

           this.setState({
             posts:newFiltered
           })
      })
    }

  render() {
    return (
      <div>
        <Router>
          <div className='row'>
            {/* header */}
            <div className="header">

              {/* nav bar */}
              <nav className='navbar row black center-align'>

                {/* logo and home link */}
                <div className='col s1 red center-align'>
                  <Link to="/">GA Blog</Link>
                </div>

                {/* create new post */}
                <div className='col s2 red'>
                  <Link to="/postCreate">(+) New Post</Link>
                </div>
                {/* search */}
                <div className="col s4 offset-s5 black searchTag">
                <form onSubmit={(e) => this.handleSearchSubmit(e)}>
                      <input className="col s6" onChange={(e) => this.handleSearchTag(e)}/>
                      <button className="col s4 red" type="submit">Search</button>
                </form>
                </div>
              </nav>
                <div className='background-image'>
                  <h1 className='red-text'>Aha!</h1>
                  <h4 className='white-text'>Share your Aha! moments at GA</h4>
                </div>
            </div>

            {/* posts */}
            <section className='col s9'>
              <Switch>

                {/* home page */}
                <Route exact path="/" render={() => (
                  <Post posts={this.state.posts} />
                )} />

                {/* create post */}
                <Route exact path="/postCreate" render={() => (
                  <Add />
                )} />

                {/* show single post */}
                <Route exact path="/:_id" render={(props) => (
                  <Show
                    {...props}
                    posts={this.state.posts}
                  />
                )} />

                {/* edit post */}
                <Route exact path="/:_id/updatePost" render={(props) => (
                  <Edit
                    {...props}
                    posts={this.state.posts}
                  />
                )} />

                {/* redirect to homepage */}
                <Route
                  path="/*"
                  render={() => (<Redirect to="/" />)}
                />
                )}/>
              </Switch>
            </section>

            {/* side nav */}
            <section className='col s3'>
              {/* local weather */}
              <div className="flexcolfeed">
                <div className="flexrow">
                  <img className="weatherIcon" src={this.state.weather} alt="weather-icon"/>
                  <div className="flexcol">
                    <label className="weatherInfo">{this.state.temperature}&#176;F</label>
                    <label>Washington, DC</label>
                  </div>
                </div>
              </div>
              {/* Upcoming Events */}
                <div className="row">
                  <h5>Upcoming Events</h5>
                </div>
                <div className="row currDate">
                    <h4>{this.state.date}</h4>
                    <p>Tech and Advertising with Twitter</p>
                    <p>Digital MArketing info Session</p>
                </div>
                <div className="row currDate">
                    <p>Adobe Indesign Bootcamp</p>
                    <p>SQL Bootcamp</p>
                    <p>Intro to R</p>
                </div>
            </section>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
