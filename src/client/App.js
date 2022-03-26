import React  from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import NotFoundError from './NotFoundError';
import { Provider } from './theme';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="*" element={<NotFoundError/>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App;