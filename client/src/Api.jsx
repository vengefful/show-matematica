import react from 'react';
import axios from 'axios';

export default axios.create({
    baseURL: 'http://192.168.253.121:5000'
});
