import React, { Component, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config.json';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';

class PreviewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    }
    this.savePost = this.savePost.bind(this);
  }
  Continue() {

  }
  savePost(e) {
    e.preventDefault();
    const req = axios.post('/api/v1/blog/newPost', {
      title: this.props.title,
      description: this.props.description,
      content: this.props.content,
      tags: this.props.tags,
      date: new Date().getTime(),
      bannerFileName: this.props.bannerFileName
    });
    req.then((response) => {
      window.location = `/`;
    }).catch((error) => {
      if(error.response.status === 429) {
        this.setState({error: 429});
      }else if(error.response.status === 422) {
        this.setState({error: 422});
      }else if(error.response.status === 401) {
        this.setState({error: 401});
      }else {
        console.log(error);
      }
    });
  }
  render() {
    const { title, content, tags } = this.props;
    const date = new Date();
    const errorCodes = {
      401: 'Wrong user or pass.',
      429: 'You got cooldown. Wait 3 seconds and try again',
      422: 'Missing parameter(s).',
      400: 'Wrong parameter(s).'
    }
    return (
      <Fragment>
        <Loader Continue={this.Continue}>
          <Navbar/>
          <div className="Container">
          {this.state.error !== '' ? 
            <p style={{color: 'red'}}>
              Error: {errorCodes[this.state.error]}
            </p> : ''}
            <h3 style={{display: 'inline', fontSize: '1.6em'}}>{title}</h3> by <span style={{color: 'red'}}>?</span>
            <div className="content" dangerouslySetInnerHTML={{__html: content}}></div>
            <hr></hr>
            <div id="postInfo">
              <ul>{tags ? tags.split(',').map(function(x, i) {
                return <li key={i}>{x}</li>
              }) : ''}</ul>
              <span>{`${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</span>
            </div>
          </div>
          <button onClick={this.savePost}>Save Post</button>
        </Loader>
      </Fragment>
    )
  }
}
function PreviewPostGet() {
  const [PostInfo] = useSearchParams();
  return (
    <PreviewPost title={PostInfo.get('title')} description={PostInfo.get('description')} content={PostInfo.get('content')} tags={PostInfo.get('tags')} bannerFileName={PostInfo.get('bannerFileName')}/>
  )
}
export default PreviewPostGet;