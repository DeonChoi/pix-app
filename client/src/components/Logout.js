import React, {useContext, useEffect} from 'react';
import {GoogleLogout} from "react-google-login";
import {Context} from './Context'


const Logout = (props) => {

    const {isLoggedIn, setIsLoggedIn} = useContext(Context)
    const {accessToken, setAccessToken} = useContext(Context)
    const {googleAccessToken, setGoogleAccessToken} = useContext(Context)
    const {GOOGLE_CLIENT_ID} = useContext(Context)

    useEffect( () => {
        console.log('logging out')
        logout()
    })

    const logout = response => {
        setIsLoggedIn(false)
        setAccessToken()
        setGoogleAccessToken()
        console.log(response)
        props.history.push('..')
        localStorage.removeItem('auth-token');
        window.location.reload();
    }

    const handleLogoutFailure = response => {
        alert('Failed to log out')
    }
    return(
        <GoogleLogout
            clientId={ GOOGLE_CLIENT_ID }
            // buttonText='Logout'
            onLogoutSuccess={logout}
            onFailure={handleLogoutFailure}
        />
    )
}

export default Logout;