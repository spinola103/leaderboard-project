import axios from 'axios';

const API = axios.create({
  baseURL: 'https://leaderboard-project-rgpj.onrender.com',
});

export default API;
