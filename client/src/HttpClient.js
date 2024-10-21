import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

const httpClient = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default httpClient;
