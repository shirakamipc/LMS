import Login from 'Components/Auth/Login';
import Register from 'Components/Auth/Register';
import AuthPage from 'Pages/Auth';
import HomePage from 'Pages/Home';
import Blog from 'Pages/Home/Blog';
import LearningPage from 'Pages/Home/Learning';
import OldLearning from 'Pages/Home/Learning/Learning';
import TypeLearning from 'Pages/Home/Learning/TypeLearning';
import Main from 'Pages/Home/Main';
import NotFound from 'Pages/NotFound';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CoursesPage from 'Pages/Home/Courses';
import PostsPage from 'Pages/Posts';
import CreatePostPage from 'Pages/CreatePost';
import PersonalPage from 'Pages/Personal';
import Courses from 'Pages/Home/Courses/Courses';
import Details from 'Pages/Home/Courses/Details';
import Learning from 'Pages/Home/Courses/Learning';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookMark from 'Pages/Home/BookMark';
import ToastTuyn from 'Components/Toast/ToastTuyn';
import { AuthProvider } from 'Context/AuthContext';
import ProtectedRoute from 'Components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position='top-right'
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path='new-post' element={<CreatePostPage />} />
        <Route path='@:username' element={<PersonalPage />} />
        <Route path='blog/:slug' element={<PostsPage />} />
        <Route path='auth' element={<AuthPage />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
        <Route path='blog/:slug' element={<PostsPage />} />
        <Route path='/' element={<HomePage />}>
          <Route path='' element={<Main />} />
          <Route path='learning' element={<LearningPage />}>
            <Route path='' element={<OldLearning />} />
            <Route path='front-end-development' element={<TypeLearning />} />
            <Route path='back-end-development' element={<TypeLearning />} />
          </Route>
          <Route path='courses' element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }>
            <Route path='' element={<Courses />} />
            <Route path=':slug' element={<Details />} />
            <Route path=':slug/learning' element={<Learning />} />
          </Route>
          <Route path='me/bookmark/posts' element={<BookMark />} />
          <Route path='blog' element={<Blog />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
