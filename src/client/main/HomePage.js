import React from 'react';
import { Link } from 'react-router-dom';
import socketioclient from 'socket.io-client';
import Status from '../components/Status';
import Loader from '../components/Loader';
import axios from 'axios';
import config from "../../config.json";
import "../../public/stylesheet/Homepage.scss";

class HomePage extends React.Component {
  _isMounted = true;
  constructor(props) {
    super(props);
    this.state = {
      presence: {status: 'unknown', activities: []},
      posts: [{ title: '' }]
    }
  }
  getPosts() {
    const req = axios.get('/api/v1/blog/posts');
    req.then((response) => {
      this.setState({
        posts: response.data
      });
      console.log(this.state.posts);
    }).catch(error => {
      console.log(error);
    });
  }
  componentDidMount() {
    this.getPosts();
    if(this._isMounted) {
      var io = socketioclient();
      io.on('status', data => {
        console.log(data);
        this.setState({
          presence: typeof data !== "null" ? data : {status: 'unknown', activities: []}
        })
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  Continue() {
    var cn = document.getElementsByClassName('Container')[0].children;
    var cns = [];
    function findAll(c, arr) {
      for(var i = 0;i<c.length;i++) {
        if(c[i].children.length > 0) {
          if(c[i].hasAttribute('apply')) cns.push(c[i]);
          findAll(c[i].children, arr);
        }else {
          if(!c[i].hasAttribute('skip') && !['SVG', 'DEFS', 'RECT', 'POLYGON', 'LINEARGRADIENT', 'ELLIPSE', 'TEXT', 'PATH'].includes(c[i].tagName)) cns.push(c[i]);
        }
      }
    }
    findAll(cn, cns);
    console.log(cns);
    cns.forEach(x => {
      x.className += "slideToLeft";
    });
    var list = document.querySelectorAll("div[data-image]");

    for (var i = 0; i < list.length; i++) {
      var url = list[i].getAttribute('data-image');
      list[i].style.backgroundImage = "linear-gradient(rgba(31, 15, 55, 0.7), rgba(31, 15, 55, 0.7)), url('" + url + "')";
    }
  }
  render() {
    const { presence } = this.state;
    console.log(this.state.posts);
    return (
      <Loader Continue={this.Continue}>
        <div className="Container">
          <div skip={""} id="avatar">
              <img skip={""} style={{width: 230, verticalAlign: "bottom"}} src="/images/Avatar.png"/>
              <button skip={""} style={{width: 32, height: 32, display: 'inline-block', background: typeof presence !== null && presence.status && presence.status === 'unknown' ? 'transparent' : (presence.status && presence.status === 'online' ? '#389E59' : 'gray'), border: '1.5px solid black', borderRadius: '100%', position: 'relative' ,left: -131, top: 6}}></button>
            </div>
            <div id="Cnt" style={{display: 'inline-block' }}>
              <h1 style={{fontSize: 45, fontWeight: 500, margin: 0, background: "linear-gradient(29deg, rgba(241,29,40,1) 0%, rgba(253,58,45,1) 25%, rgba(254,97,44,1) 50%, rgba(252,131,43,1) 75%, rgba(255,135,44,1) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Mustafa Adnan Karacabey</h1>
              <p style={{margin: 0, maxWidth: 600, fontSize: 18, textIndent: 20}}> I'm a junior web developer from Turkey. Currently I'm trying to learn game and artificial intelligence development. You can continue for more information about me.</p>
              <Status presence={presence}/>
            </div>
            <div>
              <a href="https://discord.com/channels/@me/459658370434203650" target="_blank"><img style={{width: 44}} src="/images/DiscordLogo.png"/></a>
              <a href="https://github.com/Xenon8687" target="_blank"><img style={{width: 44}} src="/images/GithubLogo.png"/></a>
            </div>
            <div className="seperator" style={{textAlign: 'center', marginTop: 30}}><hr/></div>
            <div>
              <h1 style={{fontSize: 45, fontWeight: 500, textAlign: 'center'}}>General Things I Use</h1>
              <div className="parentThing">
                <div className="thing thing1" data-image="/images/Node.jsLogo.jpg"><h1 skip={""}>Node.Js</h1></div>
                <div className="thing thing2" data-image="/images/ReactBackground.jpg"><h1 skip={""}>React</h1></div>
                <div className="thing thing3" data-image="/images/MaterialUiLogo.svg"><h1 skip={""}>Material UI</h1></div>
                <div className="thing thing4"><h1 skip={""}>Express.js</h1></div>
                <div className="thing thing5" data-image="/images/Socket.IOLogo.png"><h1 skip={""}>Socket.IO</h1></div>
                <div className="thing thing6"><h1 skip={""}>MySQL</h1></div>
                <div className="thing thing7" data-image="/images/CPPLogo.svg"><h1 skip={""}>C++</h1></div>
                <div className="thing thing8"><h1 skip={""}>Discord.js</h1></div>
                <div className="thing thing9" data-image="/images/AdobePhotoshop2020Logo.svg"><h1 skip={""}>Adobe Photoshop</h1></div>
              </div>
            </div>
            <div className="seperator" style={{textAlign: 'center', marginTop: 30}}><hr/></div>
            <div>
              <h1 style={{fontSize: 45, fontWeight: 500, textAlign: 'center'}}>My Last Blog Posts</h1>
              <div className="postsContainer">
                {this.state.posts && this.state.posts.length > 0 ? this.state.posts.slice(Math.max(this.state.posts.length - 4, 0)).reverse().map((x, i) => {
                  return (
                    <div className={"post post" + (i + 1)} key={i}>
                      <img src={"/blog/banner/" + x.banner} />

                      <div className="postBody">
                        <div className="postContent">
                          <h3>{x.title}</h3>
                          <p>{x.description}</p>
                        </div>
                        <div className="postLink">
                          <a href={`http://blog.${config.general.domain}/post/${x.short_url}_${x.id}`}><span className="f1" skip={""}></span><span className="f2" skip={""}></span></a>
                        </div>
                      </div>
                    </div>
                  )
                }) : ''}
              </div>
            </div>
        </div>
      </Loader>
    )
  }
}

export default HomePage;
