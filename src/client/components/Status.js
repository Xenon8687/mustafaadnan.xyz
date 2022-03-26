import React, { Component } from 'react';

class Status extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { presence } = this.props;
    if(presence.activities.length !== 0) {
      return <p style={{color: '#999999', maxWidth: 600}}><i apply={""}>{
        presence.activities.map((x, i) => {
          if(x.name === 'YouTube') {
            return (
              <span key={i} skip={""}> I'm watching
                <a>
                  <b skip={""} style={{color: '#22b2ea'}}> {x.details} </b>made by
                  <b skip={""} style={{color: '#22b2ea'}}> {x.state}</b>
                </a> on 
                <b skip={""} style={{color: '#4ee44e'}}> YouTube</b>
                {i !== presence.activities.length -1 ? ', ' : ''}
              </span>
            )
          }else if(x.name === 'Spotify') {
            return (
              <span key={i} skip={""}> I'm listening
                <a>
                  <b skip={""} style={{color: '#22b2ea'}}> {x.details} </b>made by
                  <b skip={""} style={{color: '#22b2ea'}}> {x.state}</b>
                </a> on 
                <b skip={""} style={{color: '#4ee44e'}}> Spotify</b>
                {i !== presence.activities.length -1 ? ', ' : ''}
              </span>
            )
          }else if(x.name === 'Netflix') {
            return (
              <span key={i} skip={""}> I'm watching
                <a>
                  <b skip={""} style={{color: '#22b2ea'}}> {x.details} </b>made by
                  <b skip={""} style={{color: '#22b2ea'}}> {x.state}</b>
                </a> on 
                <b skip={""} style={{color: '#4ee44e'}}> Spotify</b>
                {i !== presence.activities.length -1 ? ', ' : ''}
              </span>
            )
          }else {
            return (
              <span key={i} skip={""}> I'm playing
                <b skip={""} style={{color: '#22b2ea'}}> {x.name} </b>
                {i !== presence.activities.length -1 ? ', ' : ''}
              </span>
            )
          }
          /*return (
            <span key={i} skip={""}>{x.type === 'PLAYING' ? 'playing' : 'listening'}<b skip={""} style={{color: '#4ee44e'}}> {x.name}</b>{i !== presence.activities.length -1 ? ', ' : ''}</span> 
          );*/
        })
    } right now.</i></p>
    }else {
      return <p style={{color: '#656565'}}><i>I'm not doing anything right now.</i></p>;
    }
  }
}
export default Status;