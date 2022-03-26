import React from 'react';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import socketioclient from 'socket.io-client';
import anime from 'animejs';
import Status from './components/Status';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presence: {status: 'unknown', activities: []},
      loaderLetterOpacity: 0,
      finishloading: false
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loaderLetterOpacity: 1
      });
      var basicTimeline = anime.timeline();
      basicTimeline.add({
        targets: ".loaderletter .lines path",
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "linear",
        duration: 1300,
        direction: "alternate",
        loop: false
      });
      setTimeout(() => {
        this.setState({
          finishloading: true
        });
        this.Continue();
      }, 1350);
    }, 300);
    var io = socketioclient();
    io.on('status', data => {
      console.log(data);
      this.setState({
        presence: data
      })
    });
  }
  Continue() {
    var cn = document.getElementById('Cnt').children;
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
      x.className += "sa";
    });
  }
  render() {
    const { loaderLetterOpacity, finishloading, presence } = this.state;
    return (
      <Container style={{paddingTop: 40}}>
        <div id="loader" skip={""} style={{ display: finishloading ? 'none' : 'block', opacity: finishloading ? 0 : 1, position: 'absolute', top: 0, left:0, width: '100%', height: '100%', transition: 'opacity 1s', zIndex: 3 }}>
          <span skip={""} className="loaderletter" style={{ opacity: loaderLetterOpacity, position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}><svg skip={""} width="157.4" height="140" viewBox="0 0 157.4 140" xmlns="http://www.w3.org/2000/svg"><defs skip={""}><linearGradient skip={""} id='gradient' gradientUnits='userSpaceOnUse' x1='104.65%' y1='5.74%' x2='-4.65%' y2='94.26%'><stop skip={""} stopColor='#9f3d00' /><stop skip={""} offset='1' stopColor='#ff8c00' /></linearGradient></defs><g skip={""} id="svgGroup" strokeLinecap="round" fillRule="evenodd" fontSize="9pt" stroke="#000" strokeWidth="0.25mm" fill="none" style={{ stroke: "url(#gradient)", strokeWidth: "0.75mm", fill: "none" }} className="lines"><path skip={""} d="M 0 140 L 24.6 0 L 39.2 0 Q 49.4 0 55.2 2.5 A 19.572 19.572 0 0 1 61.619 7.05 A 27.769 27.769 0 0 1 65.1 11.6 Q 69.2 18.2 73.8 32 L 81.4 55.2 L 97 32 Q 104.088 21.615 109.274 15.442 A 86.478 86.478 0 0 1 111.4 13 A 40.978 40.978 0 0 1 120.512 5.402 A 37.347 37.347 0 0 1 124.5 3.3 Q 130.517 0.58 139.047 0.102 A 67.092 67.092 0 0 1 142.8 0 L 157.4 0 L 132.8 140 L 107.2 140 L 126.8 29.4 A 5.384 5.384 0 0 0 123.917 30.26 Q 123.165 30.727 122.448 31.448 A 10.404 10.404 0 0 0 122.3 31.6 A 29.214 29.214 0 0 0 121.131 32.913 Q 119.2 35.2 116.2 39.4 L 73.6 98.8 L 52.2 39.4 Q 50 33.6 48.8 31.5 A 4.7 4.7 0 0 0 47.574 30.067 Q 46.588 29.316 45.2 29.2 L 25.6 140 L 0 140 Z" vectorEffect="non-scaling-stroke" /></g></svg></span>
        </div>
        <div style={{display: finishloading ? 'block' : 'none'}}>
        <div skip={""} id="avatar">
            <img skip={""} style={{width: 230, verticalAlign: "bottom"}} src="/images/Avatar.png"/>
            <button skip={""} style={{width: 32, height: 32, display: 'inline-block', background: presence.status === 'unknown' ? 'transparent' : (presence.status === 'online' ? '#389E59' : 'gray'), border: '1.5px solid black', borderRadius: '100%', position: 'relative' ,left: -131, bottom: -16}}></button>
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
          <div className="seperator" style={{textAlign: 'center', marginTop: 30}}><img src="/images/LineSeperator.png" style={{ width: '75%', height: 50 }}/><hr/></div>
          <div>
            <h1 style={{fontSize: 45, fontWeight: 500, textAlign: 'center'}}>General Things I Use</h1>
            <div className="parentThing">
              <div className="thing thing1">
                <h1 skip={""} style={{color: '#e0e0e0', paddingTop: 20}}>Node.Js</h1>
              </div>
              <div className="thing thing2">
                <h1 skip={""} style={{color: '#e0e0e0', paddingTop: 20}}>React</h1>
              </div>
              <div className="thing thing3" style={{color: '#e0e0e0', paddingTop: 20}}><h1 skip={""} style={{color: '#e0e0e0'}}>Material UI</h1></div>
              <div className="thing thing4" style={{color: '#e0e0e0', paddingTop: 20}}><h1 skip={""} style={{color: '#e0e0e0'}}>Express.js</h1></div>
              <div className="thing thing5" style={{color: '#e0e0e0', paddingTop: 20}}><h1 skip={""} style={{color: '#e0e0e0'}}>Socket.IO</h1></div>
              <div className="thing thing6" style={{color: '#e0e0e0', paddingTop: 20}}><h1 skip={""} style={{color: '#e0e0e0'}}>MySQL</h1></div>
              <div className="thing thing7" style={{color: '#e0e0e0', paddingTop: 20}}><h1 skip={""} style={{color: '#e0e0e0'}}>C++</h1></div>
              <div className="thing thing8" style={{color: '#e0e0e0', paddingTop: 20}}><h1 skip={""} style={{color: '#e0e0e0'}}>Discord.js</h1></div>
              <div className="thing thing9" style={{color: '#e0e0e0', paddingTop: 20}}><h1 skip={""} style={{color: '#e0e0e0'}}>Adobe Photoshop</h1></div>
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

export default HomePage;
