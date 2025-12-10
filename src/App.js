// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './layout';
import Home from './home';
import Login from './login';
import SocLogin from './soc_login';
import SocLoginPage from './SocietyLoginPage';
import SocietyHome from './SocietyHome';
import FamilyLogin from "./FamilyLogin";

import Comser from "./Comser";
import WasteCollection from "./WasteCollection";



import InvFamily from './InvFamily';       // ✅ added Invite Family page
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import AdminSoc from './AdminSoc';
import AdminReg from './AdminReg';
import Recyclesign from './Recyclesign';
import RecLogin from "./reclogin";         // ✅ fixed case for consistency
import RecycleHome from './RecycleHome';
import News from './News';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main layout pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Society and family pages */}
        <Route path="/soc_login" element={<SocLogin />} />
        <Route path="/loginpage" element={<SocLoginPage />} />
        <Route path="/societyhome" element={<SocietyHome />} />
        <Route path="/familylogin" element={<FamilyLogin />} />   {/* Family login */}
        <Route path="/invite-family" element={<InvFamily />} />   {/* ✅ Invite family */}

        {/* Admin pages */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/adminsoc" element={<AdminSoc />} />
        <Route path="/adminreg" element={<AdminReg />} />

        {/* Recycler pages */}
        <Route path="/recyclesign" element={<Recyclesign />} />
        <Route path="/reclogin" element={<RecLogin />} />
        <Route path="/recyclehome" element={<RecycleHome />} />
        <Route path="/comser" element={<Comser />} />
        <Route path="/wastecollection" element={<WasteCollection />} />
         <Route path="/News" element={<News />} />
      </Routes>
    </Router>
  );
}

export default App;
