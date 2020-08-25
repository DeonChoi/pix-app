import React, {useContext} from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import {Context} from './Context'


const GoogleBtn = (props) => {
    const {GOOGLE_CLIENT_ID} = useContext(Context)

    const login = response => {
        if (response.accessToken) {
            localStorage.setItem('google-auth-token', response.accessToken);
            props.props.history.push('..')
            // window.location.reload()

        }
        console.log(response)
    }

    const logout = response => {
        console.log(response)
        // localStorage.removeItem('google-auth-token');
        localStorage.clear();
        // sessionStorage.clear();
        props.history.push('..')
        // window.location.reload()


    }

    const handleLoginFailure = response => {
        alert('Failed to log in')
    }

    const handleLogoutFailure = response => {
        alert('Failed to log out')
    }

    return (
        <>

            {
                (localStorage.getItem('auth-token') !== null || localStorage.getItem('google-auth-token') !== null)
                    ? <GoogleLogout
                        clientId={ GOOGLE_CLIENT_ID }
                        // buttonText='Logout'
                        onLogoutSuccess={logout}
                        onFailure={handleLogoutFailure}
                    />
                    : <GoogleLogin
                        clientId={ GOOGLE_CLIENT_ID }
                        // buttonText='Login'
                        onSuccess={ login }
                        onFailure={ handleLoginFailure }
                        cookiePolicy={ 'single_host_origin' }
                        responseType='code,token'
                    />
            }

        </>
    )
}

export default GoogleBtn;