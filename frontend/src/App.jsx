import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import SideBar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { data,isLoading,error,isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(!res.ok) {
          throw new Error(data.error || "Something went wrong")
        }
        console.log("authUser is here:",data)
        return data;
      } catch (error) {
        throw new Error(error);
      }
    }
  });
  if(isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/>
      </div>
    );
  }
  
  console.log("authUser is here:",data)

  return (
    <div className='flex max-w-6xl mx-auto'>
      <SideBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  )
}

export default App
