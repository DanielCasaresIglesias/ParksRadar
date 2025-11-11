import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './pages/homePage/HomePage';
import Search from './pages/searchPage/SearchPage';
import About from './pages/aboutPage/AboutPage';
// import PlanTrip from './pages/planTripPage/PlanTripPage';
import type { User } from './types/user';
import type { LoginData } from './types/loginData';
import './styles/globalStyles.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>({
    username: 'JohnDoe',
    profilePic: '/images/ProfilePhotoPlaceholder.png',
    password: 'seceret_password',
    remember: true,
  });

  const handleLogin = (loginData: LoginData) => {
    // Replace with real logic
    setUser({
      username: loginData.username,
      profilePic: loginData.profilePic,
      password: loginData.password,
      remember: loginData.remember,
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSignup = () => {
    // Your sign up logic here
  };

  return (
    <Router>
      <div className="App">
        <Header
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onSignup={handleSignup}
        />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            {/* <Route path="/search/results" element={<Search />} /> */}
            <Route path="/about" element={<About />} />
            {/* <Route path="/plan-trip" element={<PlanTrip />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
