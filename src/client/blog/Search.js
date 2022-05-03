import React, { Component, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import axios from 'axios';
import config from '../../config.json';
import "../../public/stylesheet/Search.scss";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    }
  }
  componentDidMount() {
    console.log(this.props.query);
    var req = axios.get('/api/v1/blog/search', { params: {query: this.props.query } });
    req.then((response) => {
      console.log(response.data);
      this.setState({ searchResults: response.data });
    }).catch(function (err) {
      console.log(err);
    });
  }
  Continue() {

  }
  render() {
    return (
      <Fragment>
        <Loader Continue={this.Continue}>
          <Navbar/>
          <div className="Container">
            <h2>Search Results</h2>
            <ul>
              {this.state.searchResults.map(function(x, i) {
                return (
                  <li key={i} className="searchPost">
                    <img src={"/blog/banner/" + x.banner} />
                    <div className="postBody">
                      <div className="postContent">
                        <h3>{x.title}</h3>
                        <br/>
                        <p>{x.description}</p>
                      </div>
                      <div className="postLink">
                        <a href={`http://blog.${config.general.domain}/post/${x.short_url}_${x.id}`}><span className="f1"></span><span className="f2"></span></a>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </Loader>
      </Fragment>
    )
  }
}
function SearchGet() {
  let [searchParams] = useSearchParams();
  return (
    <Fragment>
      <Search query={searchParams.get('query')} />
    </Fragment>
  );
}
export default SearchGet;
