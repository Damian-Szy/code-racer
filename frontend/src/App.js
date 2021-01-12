import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Header from "./navigation/header";
import HomeScreen from "./homescreen/homescreen";
import ProfilePage from "./profile/profilePage";
import practicePage from "./practicePage/practicePage";
import Auth from "./auth/auth";
import CreateAccountPage from "./auth/CreateAccount";
import MultiPlayerPage from "./multiplayer/multiplayerRace";
import CreateGame from "./multiplayer/createGame";
import { AuthContext } from "./context/auth-context";
import Logout from './auth/Logout'
import JoinGame from './multiplayer/JoinGame'
import "./App.css";

function App() {
  let [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);

  }, []);

  const setClientId = useCallback(id => {
    setUserId(id);
  }, []);

  const setUserName = useCallback(username => {
    setUser(username)
  }, [])
  


  return (
    <AuthContext.Provider
      value={{isLoggedIn: isLoggedIn, login: login, logout: logout, clientId: userId, setClientId: setClientId, username: user, setUsername: setUserName}}
    >
      <BrowserRouter>
        <header>
          <Header isLoggedIn={isLoggedIn} />
        </header>
        <main>
          <Switch>
            <Route path="/" exact component={HomeScreen} />
            <Route path="/profile/:userId" component={ProfilePage} />
            <Route path="/practice" component={practicePage} />
            <Route path="/auth" component={Auth} />
            <Route path="/create-account" component={CreateAccountPage} />
            <Route path="/game/:gameId" component={MultiPlayerPage} />
            <Route path="/join-game/:gameId" component={JoinGame} />
            <Route
              path="/create-game"
              render={() => <CreateGame userId={userId} username="Damian" />}
            />
            <Route path="/logout" component={Logout} />
            <Redirect to="/" />
          </Switch>
          <div className='repo-link-div'>
          <a className='repo-link' href='https://github.com/Damian-Szy/code-racer'>Github Repository</a>
          </div>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
