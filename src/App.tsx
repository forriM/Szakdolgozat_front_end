
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import { useAuth } from './hooks/useAuth'
import CardUpload from './pages/CardUpload'
import Header from './components/Header'
import Groups from './pages/Groups'
import Group from './pages/Group'
import { Loading } from './components/Loading'
import CompanyRegister from './pages/CompanyRegister'

const App = () => {
  const { token, loading, isLoadingToken } = useAuth();

  console.log('Token in App component:', token);

  return (
    <>
      <Header />
      {loading || isLoadingToken ? (
        <Loading />
      ) : (
        <Routes>
          <Route path='/login' element={token ? <Navigate to='/' /> : <Login />} />
          <Route path='/register' element={token ? <Navigate to='/' /> : <Register />} />
          <Route path='/register-company' element={token ? <Navigate to='/' /> : <CompanyRegister />} />
          <Route path='/' element={token ? <Home /> : <Navigate to='/login' />} />
          <Route path='/groups' element={token ? <Groups /> : <Navigate to='/login' />} />
          <Route path='/groups/:id' element={token ? <Group /> : <Navigate to='/login' />} />
          <Route path='/upload' element={token ? <CardUpload /> : <Navigate to='/login' />} />
        </Routes>
      )}
    </>
  );
};

export default App;
