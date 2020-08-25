import React, {useContext, useState} from "react";
import axios from 'axios';
import {GoogleLogin} from "react-google-login";
import {Context} from "./Context";

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const {GOOGLE_CLIENT_ID} = useContext(Context);

    const handleEmail = (e) => {
        setEmail(e.target.value.trim())
    }
    const handlePassword = (e) => {
        setPassword(e.target.value.trim())
    }
    const handleFirstName = (e) => {
        setFirstName(e.target.value.trim())
    }
    const handleLastName = (e) => {
        setLastName(e.target.value.trim())
    }

    const register = async (response) => {
        if (response.tokenId) {
            const newUser = {
                firstName: response.profileObj.givenName,
                lastName: response.profileObj.familyName,
                email: response.profileObj.email,
            }
            await axios.post('/google/register', newUser)
                .then(res => {
                    // console.log(res)
                    console.log('Logged in')
                    props.history.push('../login')
                })
                .catch(err => console.log(err))
            props.history.push('../login')
        }
        // console.log(response)
    }
    const handleLoginFailure = response => {
        alert('Failed to log in')
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            firstName,
            lastName,
            email,
            password
        };
        await axios.post('/user/register', newUser)
            .then(res => {
                // console.log(res)
                console.log('Logged in')
                props.history.push('../login')
            })
            .catch(err => console.log(err))
    };
    return (
        <div className='d-flex justify-content-center mt-5 flex-column align-items-center'>
            <form onSubmit={onSubmit} className='d-flex flex-column'>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" className="form-control" id="firstName" aria-describedby="emailHelp" required placeholder='John'
                           onChange={handleFirstName}
                           pattern="[A-Za-z]{1,}"
                           autoComplete='true'
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" className="form-control" id="lastName" aria-describedby="emailHelp" required placeholder='Doe'
                           onChange={handleLastName}
                           pattern="[A-Za-z]{1,}"
                           autoComplete='true'
                    />
                </div>
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
                <button type="submit" className="btn btn-primary">Register</button>
            </form>

            <br/>
            <p>or</p>
            <GoogleLogin
                clientId={ GOOGLE_CLIENT_ID }
                buttonText='Sign up with Google'
                onSuccess={ register }
                onFailure={ handleLoginFailure }
                cookiePolicy={ 'single_host_origin' }
                responseType='code,token'
            />
        </div>
    )
}

export default Register;