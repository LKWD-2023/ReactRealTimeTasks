import React from 'react';
import { Route, Routes } from 'react-router';
import Layout from './Layout';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import { AuthContextComponent } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Logout from './Logout';


const App = () => {
    return (
        <AuthContextComponent>
            <Layout>
                <Routes>
                    <Route exact path='/' element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />
                    <Route exact path='/signup' element={<Signup />} />
                    <Route exact path='/login' element={<Login />} />
                    <Route exact path='/logout' element={
                        <PrivateRoute>
                            <Logout />
                        </PrivateRoute>
                    } />
                </Routes>
            </Layout>
        </AuthContextComponent>
    );
}

export default App;