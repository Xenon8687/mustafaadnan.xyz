import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes, Switch } from 'react-router-dom';
import Blog from './Blog';
import BlogPost from './BlogPost';
import Search from './Search';
import NotFoundError from '../NotFoundError';

const BlogViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Blog/>} />
        <Route path="/post/:post" exact={true} element={<BlogPost/>} />
        <Route path="/search" exact={true} element={<Search/>} />
        <Route path="*" exact={true} element={<NotFoundError/>} />
      </Routes>
  </BrowserRouter>
  );
};
export default BlogViews;