import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import NotFoundError from '../NotFoundError';
const MainViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="*" element={<NotFoundError/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default MainViews;