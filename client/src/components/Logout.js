import React, {useContext, useEffect} from 'react';
import {GoogleLogout} from "react-google-login";
import {Context} from './Context'


const Logout = (props) => {

    const {GOOGLE_CLIENT_ID} = useContext(Context)

    useEffect( () => {
        console.log('logging out')
        logout()
    })

    const logout = response => {
        console.log(response)
        props.history.push('..')
        // localStorage.removeItem('google-auth-token');
        // localStorage.removeItem('google-email');
        // localStorage.removeItem('auth-token');
        // localStorage.removeItem('email');
        localStorage.clear();
        // window.location.reload();
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