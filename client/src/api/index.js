import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'http://localhost:5000/api'
})

export const getHeroes = async (limit, offset) => await httpClient.get(`/superheroes?limit=${limit}&offset=${offset}`);

export const deleteHero = async (heroId) => await httpClient.delete(`/superheroes/${heroId}`);

export const deletePower = async(heroId, powerId) => await httpClient.delete(`/superheroes/${heroId}/powers/${powerId}`);

export const addPower = async(heroId, powers) => await httpClient.post(`/superheroes/${heroId}/powers`, {powers});

export const editHero = async (heroId, updatedHero) => await httpClient.put(`/superheroes/${heroId}`, updatedHero);

export const addHero = async (hero) => await httpClient.post('/superheroes', hero);

export const deleteImage = async (heroId, imageId) =>
await httpClient.delete(`/superheroes/${heroId}/images/${imageId}`);

export const createRandomHero = async () => await httpClient.post('/superheroes/random');