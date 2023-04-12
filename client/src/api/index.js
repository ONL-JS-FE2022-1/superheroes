import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'http://localhost:5000/api'
})

export const getHeroes = async () => httpClient.get('/superheroes');

export const deleteHero = async (heroId) => httpClient.delete(`/superheroes/${heroId}`);

export const deletePower = async(heroId, powerId) => httpClient.delete(`/superheroes/${heroId}/powers/${powerId}`);

export const addPower = async(heroId, powers) => httpClient.post(`/superheroes/${heroId}/powers`, {powers});