import {createContext} from 'react'

export const AuthContext = createContext({isLoggedIn: false, login: () => {}, logout: () => {}, clientId: null, setClientId: () => {}, username: '', setUsername: () => {}})