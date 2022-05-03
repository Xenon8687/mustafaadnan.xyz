import React, { Component, Fragment } from 'react';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import axios from 'axios';
import config from '../../config.json';

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [''],
    }
  }
  componentDidMount() {
    var req = axios.get('/api/v1/blog/posts');
    req.then((response) => {
      response.data.reverse();
      this.setState({ posts: response.data });
    }).catch((err) => {
      console.log(err);
    });
  }
  Continue() {

  }
  render() {
    var { currentPosts, posts, page } = this.state;
    console.log(posts);
    /*let pages = [];
    for(var i = 0; i < Math.round(posts.length / 5); i++) {
      pages.push(posts.splice(i * 5, i * 5 + 5));
    }
    if(posts.length % 5 > 0) {
      pages.push(posts.splice(posts.length - posts % 5, posts.length));
    }console.log(page, page * 5 + 5 > posts.length ? (posts.length - (posts.length % 5)) : page * 5 + 5);page * 5, page === posts.length ? page * 5 + posts.length % 5 : page * 5 + 5*/
    return (
      <Fragment>
        <Loader Continue={this.Continue}>
          <Navbar/>
          <div className="Container">
            <div className="PostsContainer">
              <ul>
                {posts.map(function(x, i) {
                  return (
                    <div key={i} className="Post">
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
                    </div>
                  )
                })}
              </ul>
            </div>
          </div>
        </Loader>
      </Fragment>
    )
  }
}