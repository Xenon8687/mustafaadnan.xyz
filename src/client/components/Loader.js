import React, { Component, Fragment } from 'react'
import anime from 'animejs';

export default class Loader extends Component {
  _isMounted = true;
  constructor(props) {
    super(props);
    this.state = {
      loaderLetterOpacity: 0,
      finishloading: false
    }
  }
  componentDidMount() {
    if(this._isMounted) {
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
          this.props.Continue();
        }, 1350);
      }, 300);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const { loaderLetterOpacity, finishloading } = this.state;
    return (
      <Fragment>
        <div id="loader" skip={""} style={{ display: finishloading ? 'none' : 'block', opacity: finishloading ? 0 : 1, position: 'absolute', top: 0, left:0, width: '100%', height: '100%', transition: 'opacity 1s', zIndex: 3 }}>
          <span skip={""} className="loaderletter" style={{ opacity: loaderLetterOpacity, position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}><svg skip={""} width="157.4" height="140" viewBox="0 0 157.4 140" xmlns="http://www.w3.org/2000/svg"><defs skip={""}><linearGradient skip={""} id='gradient' gradientUnits='userSpaceOnUse' x1='104.65%' y1='5.74%' x2='-4.65%' y2='94.26%'><stop skip={""} stopColor='#9f3d00' /><stop skip={""} offset='1' stopColor='#ff8c00' /></linearGradient></defs><g skip={""} id="svgGroup" strokeLinecap="round" fillRule="evenodd" fontSize="9pt" stroke="#000" strokeWidth="0.25mm" fill="none" style={{ stroke: "url(#gradient)", strokeWidth: "0.75mm", fill: "none" }} className="lines"><path skip={""} d="M 0 140 L 24.6 0 L 39.2 0 Q 49.4 0 55.2 2.5 A 19.572 19.572 0 0 1 61.619 7.05 A 27.769 27.769 0 0 1 65.1 11.6 Q 69.2 18.2 73.8 32 L 81.4 55.2 L 97 32 Q 104.088 21.615 109.274 15.442 A 86.478 86.478 0 0 1 111.4 13 A 40.978 40.978 0 0 1 120.512 5.402 A 37.347 37.347 0 0 1 124.5 3.3 Q 130.517 0.58 139.047 0.102 A 67.092 67.092 0 0 1 142.8 0 L 157.4 0 L 132.8 140 L 107.2 140 L 126.8 29.4 A 5.384 5.384 0 0 0 123.917 30.26 Q 123.165 30.727 122.448 31.448 A 10.404 10.404 0 0 0 122.3 31.6 A 29.214 29.214 0 0 0 121.131 32.913 Q 119.2 35.2 116.2 39.4 L 73.6 98.8 L 52.2 39.4 Q 50 33.6 48.8 31.5 A 4.7 4.7 0 0 0 47.574 30.067 Q 46.588 29.316 45.2 29.2 L 25.6 140 L 0 140 Z" vectorEffect="non-scaling-stroke" /></g></svg></span>
        </div>
        <div style={{display: finishloading ? 'block' : 'none'}}>
          {this.props.children}
        </div>
      </Fragment>
    )
  }
}
