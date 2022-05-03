import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config.json';
import "../../public/stylesheet/Navbar.scss";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      navbar: false
    }
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      navbar: this.state.navbar ? false : true
    });
  }
  render() {
    return (
      <Fragment>
        <div className={"navbar " + (this.state.navbar ? 'active' : '')}>
          <h2>mustafaadnan.xyz</h2>
          <ul>
            <li><a href={`http://${config.general.domain}`}>Home</a></li>
            <li><a href={`http://blog.${config.general.domain}`}>Blog</a></li>
            <li><form><input type="text" placeholder="Search..." value={this.state.query} onChange={(e) => {this.setState({query: e.target.value })}}/><a className="go" href={`http://blog.${config.general.domain}/search?query=${this.state.query}`}>➤</a></form></li>
          </ul>
          <span className="navbarToggle" onClick={this.toggle}>
            <span className="first"></span>
            <span className="second"></span>
            <span className="third"></span>
          </span>
        </div>
        {this.props.children}
      </Fragment>
    )
  }
}