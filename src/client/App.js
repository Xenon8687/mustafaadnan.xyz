import React  from 'react';
import { hot } from 'react-hot-loader/root';
import MainViews from './main/Router';
import { Provider } from './theme';
import BlogViews from './blog/Router';
import AdminViews from './admin/Router';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let host = window.location.host;
    let protocol = window.location.protocol;
    let parts = host.split(".");
    let subdomain = "";
    if (parts.length >= 3) {
      subdomain = parts[0];
    }
    console.log(parts);
    console.log(subdomain);
    return (
      <Provider>
        {
          subdomain === '' ? <MainViews/> : ''
        }
        {
          subdomain === 'blog' ? <BlogViews/> : ''
        }
        {
          subdomain === 'admin' ? <AdminViews/> : ''
        }
      </Provider>
    )
  }
}

export default hot(App);