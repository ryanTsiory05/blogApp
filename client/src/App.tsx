import { Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
import MyPosts from './pages/posts/myPosts/MyPosts';
import ListPost from './pages/posts/listPosts/ListPosts';
import DetailPost from './pages/posts/DetailPost';
import Navbar from './components/layout/NavBar/NavBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ListPost />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/posts/:id" element={<DetailPost />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;