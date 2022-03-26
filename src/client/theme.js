import React, { Component, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'universal-cookie';
import CssBaseline from '@mui/material/CssBaseline'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const cookies = new Cookies();

const lightTheme = createTheme({
  palette: {
    background: {
      default: "#FFFFFF"
    },
    text: {
      primary: "#000000"
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Poppins"',
      'Roboto',
      'Arial',
    ].join(',')
  }
});
const darkTheme = createTheme({
  palette: {
    background: {
      default: "#222222"
    },
    text: {
      primary: "#ffffff"
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Poppins"',
      'Roboto',
      'Arial',
    ].join(','),
  }
});

const ThemeContext = React.createContext({
  theme: cookies.get('theme'),
  setTheme: () => {}  
});

class Provider extends React.Component {
  constructor(props) {
    super(props);
    if(typeof cookies.get('theme') === 'undefined') cookies.set('theme', 'light');
    this.setTheme = () => {
      this.setState(state => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      }));
      cookies.set('theme', this.state.theme === 'light' ? 'dark' : 'light');
    };
    this.state = {
      theme: cookies.get('theme'),
      setTheme: this.setTheme
    };
    React.Component.getThemeProp = () => {return (this.state.theme === 'light' ? lightTheme : darkTheme)};
  }
  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <ThemeProvider theme={this.state.theme === 'light' ? lightTheme : darkTheme}>
          <CssBaseline />
          <ThemeButton />
          {this.props.children}
        </ThemeProvider>
      </ThemeContext.Provider>
    )
  }
}

class ThemeButton extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({theme, setTheme}) => (
          <button style={{position: 'fixed', bottom: 32, right: 32, background: theme === 'light' ? darkTheme.palette.background.default : lightTheme.palette.background.default, color: theme === 'light' ? darkTheme.palette.text.primary : lightTheme.palette.text.primary, border: 'none', padding: '3px 5px 2px 4px', borderRadius: '32px', width: 56, height: 56, cursor: 'pointer'}} onClick={setTheme}>
            {(() => theme === 'light' ? <DarkModeIcon style={{ fontSize: 38 }}/> : <LightModeIcon style={{ fontSize: 38 }}/>)()}
          </button>
        )}
      </ThemeContext.Consumer>
    )
  }
}
export { Provider, ThemeButton, ThemeContext, lightTheme, darkTheme }