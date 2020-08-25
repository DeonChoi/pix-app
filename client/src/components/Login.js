import React, {useContext, useState} from 'react';
import { GoogleLogin } from "react-google-login";
import {Context} from "./Context";

import axios from 'axios';

const Login = (props) => {

    const {GOOGLE_CLIENT_ID} = useContext(Context)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async (response) => {
        if (response.tokenId) {
            const userLogin = {
                email: response.profileObj.email,
            }
            // console.log(response)
            await axios.post('/google/login', userLogin)
                .then( res => {
                    // console.log(res);
                    console.log('Logged In');
                    localStorage.setItem('google-auth-token', response.tokenId);
                    localStorage.setItem('google-email', response.profileObj.email);
                    props.history.push('..');
                    // window.location.reload();
                })
                .catch( err => console.error(err));

            console.log('logging in')
            // console.log(response.profileObj.email)
            props.history.push('..')
        }
        // console.log(response)
    }
    const handleLoginFailure = response => {
        console.log(response);
        console.log('Failed to log in')
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const userLogin = {
            email,
            password
        };
        await axios.post('/user/login', userLogin)
            .then( res => {
                // console.log(res);
                console.log('Logged In');
                localStorage.setItem('auth-token', res.data.token);
                localStorage.setItem('email', res.data.email)
                props.history.push('..');
                // window.location.reload();
            })
            .catch( err => console.error(err));
    };

    return (
        <div className='d-flex justify-content-center mt-5 flex-column align-items-center'>
            <form onSubmit={onSubmit} className='d-flex flex-column'>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" required placeholder='johndoe@gmail.com'
                           onChange={handleEmail}
                           autoComplete='true'
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" required placeholder='••••••'
                           maxLength='12' minLength='6'
                           onChange={handlePassword}
                           pattern=".{6,}"
                           autoComplete='true'
                    />
                    <small id="passwordHelp" className="form-text text-muted">We'll never share your password with anyone.</small>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>

            </form>

            <br/>
            <p>or</p>
            <GoogleLogin
                clientId={ GOOGLE_CLIENT_ID }
                // buttonText='Login'
                onSuccess={ login }
                onFailure={ handleLoginFailure }
                cookiePolicy={ 'single_host_origin' }
                responseType='code,token'
            />
        </div>
    )
}

export default Login;