import { useEffect } from "react";

const Logout = (props) => {
	useEffect(() => {
		console.log("Logging out");
		logout();
	});

	const logout = (response) => {
		localStorage.clear();
		props.history.push("..");
	};

	return null;
};

export default Logout;
