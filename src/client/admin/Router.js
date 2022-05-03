import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes, Switch } from 'react-router-dom';
import Admin from './Admin';
import PreviewPost from './PreviewPost';
import NotFoundError from '../NotFoundError';

const BlogViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/preview" exact={true} element={<PreviewPost/>} />
        <Route path="*" exact={true} element={<NotFoundError/>} />
      </Routes>
  </BrowserRouter>
  );
};
export default BlogViews;