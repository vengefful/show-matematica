import react from 'react';
import axios from 'axios';

export default axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json'
    }
});
