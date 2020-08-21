import React, {useContext} from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import {Context} from './Context'


const GoogleBtn = (props) => {
    const {GOOGLE_CLIENT_ID} = useContext(Context)

    const {isLoggedIn, setIsLoggedIn} = useContext(Context)
    const {accessToken, setAccessToken} = useContext(Context)
    const {googleAccessToken, setGoogleAccessToken} = useContext(Context)

    const login = response => {
        if (response.accessToken) {
            setIsLoggedIn(true)
            setAccessToken(response.accessToken)
            setGoogleAccessToken(response.accessToken)
            localStorage.setItem('auth-token', response.accessToken);

            props.props.history.push('..')
            // window.location.reload()

        }
        console.log(response)
    }

    const logout = response => {
        setIsLoggedIn(false)
        setAccessToken()
        setGoogleAccessToken()
        console.log(response)
        localStorage.removeItem('auth-token');
        localStorage.clear();
        // sessionStorage.clear();
        props.history.push('..')
        window.location.reload()


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
                isLoggedIn
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
            {/*{*/}
            {/*    accessToken*/}
            {/*        ? <h5>Your Access Token: <br/> {accessToken}</h5>*/}
            {/*        : null*/}
            {/*}*/}

        </>
    )
}

export default GoogleBtn;