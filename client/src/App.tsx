import { Routes, Route, Navigate } from "react-router-dom";
import MyPosts from "./pages/posts/my-posts/MyPosts";
import ListPost from "./pages/posts/list/ListPosts";
import PostDetail from "./pages/posts/detail/PostDetail";
import Navbar from "./components/layout/NavBar/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<ListPost />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/posts/:id" element={<PostDetail />} />
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
      </AuthProvider>
    </div>
  );
}

export default App;
