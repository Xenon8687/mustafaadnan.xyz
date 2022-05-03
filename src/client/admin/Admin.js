import React, { Component } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from 'axios';
import config from '../../config.json';
import "../../public/stylesheet/Admin.scss";

export default class Blog extends Component {
  constructor() {
    super();
    this.state = {
      error: '',
      authorize_user: '',
      authorize_pass: '',
      authorize_isAuthorized: false,
      newPost_title: '',
      newPost_description: '',
      newPost_content: '',
      newPost_tags: '',
      newPost_bannerFileName: '',
      uploadBanner_bannerFileName: '',
      uploadBanner_file: null,
      updatePost_id: '',
      updatePost_property: '',
      updatePost_value: '',
      removeBanner_fileName: '',
      posts: [],
      banners: []
    }
    this.authorize = this.authorize.bind(this);
    this.createNewPost = this.createNewPost.bind(this);
    this.removePost = this.removePost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.uploadBanner = this.uploadBanner.bind(this);
    this.removeBanner = this.removeBanner.bind(this);
  }
  authorize(e) {
    e.preventDefault();
    console.log(this.state.authorize_user);
    const req = axios.post('/api/v1/blog/authorize', {
      user: this.state.authorize_user,
      pass: this.state.authorize_pass,
      validateStatus: function (status) {
        return status < 500;
      }
    });
    req.then((response) => {
      this.testAuthentication();
    }).catch((error) => {
      if(error.response.status === 429) {
        this.setState({error: 429});
      }else if(error.response.status === 422) {
        this.setState({error: 422});
      }else {
        console.log(error);
      }
    });
  }
  testAuthentication() {
    const req = axios.post('/api/v1/blog/test', {
      validateStatus: function (status) {
        return status < 500;
      }
    });
    req.then((response) => {
      console.log(response.status);
      this.setState({authorize_isAuthorized: true});
    }).catch((error) => {
      if(error.response.status === 401) {
        this.setState({authorize_isAuthorized: false});
      }else console.log(error);
    });;
  }
  getPosts() {
    const req = axios.get('/api/v1/blog/posts', {
      validateStatus: function (status) {
        return status < 500;
      }
    });
    req.then((response) => {
      this.setState({
        posts: response.data
      });
      console.log(this.state.posts);
    }).catch(error => {
      console.log(error);
    });
  }
  createNewPost(e) {
    e.preventDefault();
    const req = axios.post('/api/v1/blog/newPost', {
      title: this.state.newPost_title,
      description: this.state.newPost_description,
      content: this.state.newPost_content,
      tags: this.state.newPost_tags,
      date: new Date().getTime(),
      bannerFileName: this.state.newPost_bannerFileName
    });
    req.then((response) => {
      this.getPosts();
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
  removePost(e, id) {
    e.preventDefault();
    const req = axios.post('/api/v1/blog/removePost', {
      id: id
    });
    req.then((response) => {
      this.getPosts();
    }).catch((error) => {
      if(error.response.status === 429) {
        this.setState({error: 429});
      }else if(error.response.status === 422) {
        this.setState({error: 422});
      }else if(error.response.status === 401) {
        this.setState({error: 401});
      }else if(error.response.status === 400) {
        this.setState({error: 400});
      }else {
        console.log(error);
      }
    });
  }
  updatePost(e) {
    e.preventDefault();
    const req = axios.post('/api/v1/blog/updatePost', {
      id: this.state.updatePost_id,
      property: this.state.updatePost_property,
      value: this.state.updatePost_value
    });
    req.then((response) => {
      this.getPosts();
    }).catch((error) => {
      if(error.response.status === 429) {
        this.setState({error: 429});
      }else if(error.response.status === 422) {
        this.setState({error: 422});
      }else if(error.response.status === 401) {
        this.setState({error: 401});
      }else if(error.response.status === 400) {
        this.setState({error: 400});
      }else {
        console.log(error);
      }
    });
  }
  handleFileChange(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    console.log(file);
    this.setState({
      uploadBanner_file: file
    });
  }
  uploadBanner(event) {
    event.preventDefault();
    var formData = new FormData();
    formData.append("fileName", this.state.uploadBanner_bannerFileName);
    formData.append("image", this.state.uploadBanner_file);
    console.log(formData);
    axios.post('/api/v1/blog/uploadBanner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  removeBanner(e) {
    e.preventDefault();
    const req = axios.post('/api/v1/blog/removeBanner', {
      fileName: this.state.removeBanner_fileName
    });
    req.then((response) => {
      this.getPosts();
    }).catch((error) => {
      if(error.response.status === 429) {
        this.setState({error: 429});
      }else if(error.response.status === 422) {
        this.setState({error: 422});
      }else if(error.response.status === 401) {
        this.setState({error: 401});
      }else if(error.response.status === 400) {
        this.setState({error: 400});
      }else {
        console.log(error);
      }
    });
  }
  getBanners() {
    const req = axios.get('/api/v1/blog/getBanners', {
      validateStatus: function (status) {
        return status < 500;
      }
    });
    req.then((response) => {
      this.setState({
        banners: response.data
      });
      console.log(this.state.posts);
    }).catch(error => {
      console.log(error);
    });
  }
  componentDidMount() {
    this.testAuthentication();
    this.getPosts();
    this.getBanners();
  }
  render() {
    const errorCodes = {
      401: 'Wrong user or pass.',
      429: 'You got cooldown. Wait 3 seconds and try again',
      422: 'Missing parameter(s).',
      400: 'Wrong parameter(s).'
    }
    return (
      <div className="Container">
        {this.state.authorize_isAuthorized ? <p style={{color: 'green'}}>You are just authorized.</p> : <p style={{color: 'red'}}>You are not authorized.</p>}
        {this.state.error !== '' ? 
          <p style={{color: 'red'}}>
            Error: {errorCodes[this.state.error]}
          </p> : ''}
        <h1>AUTHORIZATION</h1>
        <form onSubmit={this.authorize}>
          <input type="text" placeholder="user name" value={this.state.authorize_user} onChange={(e) => {this.setState({authorize_user: e.target.value })}} />
          <br/>
          <input type="text" placeholder="pass" value={this.state.authoriz_pass} onChange={(e) => {this.setState({authorize_pass: e.target.value })}} />
          <br/>
          <input type="submit" value="Authorize Me" />
        </form>
        <h1>NEW POST</h1>
        <form onSubmit={this.createNewPost}>
          <input type="text" placeholder="title" value={this.state.newPost_title} onChange={(e) => {this.setState({newPost_title: e.target.value })}} />
          <br/>
          <input type="text" placeholder="description" value={this.state.newPost_description} onChange={(e) => {this.setState({newPost_description: e.target.value })}} />
          <br/>
          <input type="text" placeholder="tags" value={this.state.newPost_tags} onChange={(e) => {this.setState({newPost_tags: e.target.value })}} />
          <br/>
          <input type="text" placeholder="banner file name" value={this.state.newPost_bannerFileName } onChange={(e) => {this.setState({newPost_bannerFileName: e.target.value })}} />
          <br/>
          <CodeEditor
            value={this.state.newPost_content}
            language="html"
            onChange={(e) => {this.setState({newPost_content: e.target.value})}}
            padding={15}
            style={{
              fontSize: 16,
              borderRadius: 6
            }}
          />
          <input type="submit" value="Create new post"/>
          <a href={`/preview?title=${this.state.newPost_title}&description=${this.state.newPost_description}&content=${this.state.newPost_content}&tags=${this.state.newPost_tags}&bannerFileName=${this.state.newPost_bannerFileName}`}>Preview Post</a>
        </form>
        <h1>UPLOAD A BANNER</h1>
        <form onSubmit={this.uploadBanner}>
          <input type="text" placeholder="banner file name" value={this.state.uploadBanner_bannerFileName } onChange={(e) => {this.setState({uploadBanner_bannerFileName: e.target.value })}} />
          <br/>
          <input type="file" onChange={this.handleFileChange} />
          <br/>
          <input type="submit" value="Upload a banner"/>
        </form>
        <h1>REMOVE A BANNER</h1>
        <form onSubmit={this.removeBanner}>
          <input type="text" placeholder="banner file name" value={this.state.removeBanner_fileName } onChange={(e) => {this.setState({removeBanner_fileName: e.target.value })}} />
          <br/>
          <input type="submit" value="Remove that banner"/>
        </form>
        <h1>UPDATE A POST</h1>
        <form onSubmit={this.updatePost}>
          <input type="text" placeholder="ID" value={this.state.updatePost_id} onChange={(e) => {this.setState({updatePost_id: e.target.value })}} />
          <br/>
          <input type="text" placeholder="property" value={this.state.updatePost_property} onChange={(e) => {this.setState({updatePost_property: e.target.value })}} />
          <br/>
          <input type="text" placeholder="value" value={this.state.updatePost_value} onChange={(e) => {this.setState({updatePost_value: e.target.value })}} />
          <br/>
          <input type="submit" value="Update Post" />
        </form>
        <h1>ALL POSTS</h1>
        <table style={{borderCollapse: "collapse"}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Tags</th>
              <th>Short URL</th>
              <th>Author</th>
              <th>Banner</th>
              <th>Remove this post</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((x, i) => {
              return (
                <tr key={i}>
                  <td>{x.id}</td>
                  <td>{x.title}</td>
                  <td>{x.description}</td>
                  <td>{x.tags}</td>{/* TODO: Update for an array. */}
                  <td>{x.short_url}</td>
                  <td>{x.author}</td>
                  <td><a href={"/blog/banner/" + x.banner}>CLICK</a></td>
                  <td><a onClick={(e) => {this.removePost(e, x.id)}}>X</a></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <h1>ALL BANNERS</h1>
        <ul>
          {this.state.banners.map((x, i) => {
            return (
              <li key={i}><a href={"/blog/banner/" + x}>{x}</a></li>
            )
          })}
        </ul>
      </div>
    )
  }
}