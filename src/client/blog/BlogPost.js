import React, { Component, Fragment } from 'react';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useMatch } from "react-router-dom";
import "../../public/stylesheet/Blog.scss";

class BlogPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        title: 'Can\'t load',
        content: 'Can\'t load',
        author: 'Can\'t load',
        tags: 'Can\t, load',
        date: 0
      }
    }
    this.getPost = this.getPost.bind(this);
  }
  getPost() {
    console.log(typeof this.props.postId);
    var req = axios.get('/api/v1/blog/post', {params: {id: this.props.postId.split('_')[this.props.postId.split('_').length]}});
    req.then((response) => {
      this.setState({
        post: response.data[0]
      })
    }).catch(function (error) {
      console.log(error);
    });
  }
  componentDidMount() {
    this.getPost();
  }
  Continue() {
    
  }
  render() {
    let { post } = this.state;
    let date = new Date(Number(post.date));
    console.log(date);
    return (
      <Fragment>
        <Loader Continue={this.Continue}>
          <Navbar/>
          <div className="Container">
            <h3 style={{display: 'inline', fontSize: '1.6em'}}>{post.title}</h3> by <span style={{color: 'red'}}>{post.author}</span>
            <div className="content" dangerouslySetInnerHTML={{__html: post.content}}></div>
            <hr></hr>
            <div id="postInfo">
              <ul>{post.tags.split(',').map(function(x, i) {
                return <li key={i}>{x}</li>
              })}</ul>
              <span>{`${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</span>
            </div>
          </div>
        </Loader>
      </Fragment>
    )
  }
}
function BlogPostGet() {
  let id = useMatch("/post/:post");
  return (
    <Fragment>
      <BlogPost postId={id.params.post} />
    </Fragment>
  );
}
export default BlogPostGet;