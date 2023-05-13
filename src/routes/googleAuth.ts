

import axios from "axios"

const SERVER_ENDPOINT_URL= import.meta.env.VITE_SERVER_URI;

export const getUserDataGoogle = async (accessToken: string) => {
	//console.log("send a request to back to verify token");
	const { data } = await axios.get(`${SERVER_ENDPOINT_URL}/api/google/userData`, {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Authorization": `Bearer ${accessToken}`
		},
	})
	//console.log(data);
	return data
}