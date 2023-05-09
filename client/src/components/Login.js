import React, { useState } from "react";

import axios from "axios";

const Login = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);

	const handleEmail = (e) => {
		setEmail(e.target.value);
		e.target.style.border = "none";
	};
	const handlePassword = (e) => {
		setPassword(e.target.value);
		e.target.style.border = "none";
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const userLogin = {
			email,
			password,
		};
		setError(false);
		await axios
			.post("/user/login", userLogin)
			.then((res) => {
				console.log("Logged In");
				localStorage.setItem("auth-token", res.data.token);
				localStorage.setItem("email", res.data.email);
				props.history.push("..");
			})
			.catch((err) => {
				setError(true);
				console.error(err);
			});
	};

	return (
		<div className="d-flex justify-content-center mt-5 flex-column align-items-center">
			<form onSubmit={onSubmit} className="d-flex flex-column">
				<div className="form-group">
					<label htmlFor="email">Email Address</label>
					<input
						type="email"
						className="form-control"
						id="email"
						aria-describedby="emailHelp"
						required
						placeholder="johndoe@gmail.com"
						onChange={handleEmail}
						autoComplete="true"
						style={error ? { border: "2px solid red" } : {}}
					/>
					<small id="emailHelp" className="form-text text-muted">
						We'll never share your email with anyone.
					</small>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						className="form-control"
						id="password"
						required
						placeholder="••••••"
						maxLength="12"
						minLength="6"
						onChange={handlePassword}
						pattern=".{6,}"
						autoComplete="true"
						style={error ? { border: "2px solid red" } : {}}
					/>
					<small id="passwordHelp" className="form-text text-muted">
						We'll never share your password with anyone.
					</small>
				</div>
				{error ? (
					<small className="form-text text-danger text-center">
						Invalid Email or Password
					</small>
				) : (
					""
				)}
				<button type="submit" className="btn btn-primary">
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
