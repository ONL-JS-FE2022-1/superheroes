const fs = require('fs').promises;
const { STATIC_PATH } = require('../config');
const path = require('path');
const axios = require('axios');

module.exports.createPublicFolder = async path => {
    await fs.mkdir(path, {recursive: true});
}

module.exports.deleteImage = async imageName => {
    await fs.unlink(path.join(STATIC_PATH, 'images', imageName));
}

const generateRobohash = async (imageName) => {
    const robohashUrl = `https://robohash.org/${imageName}`;
    const response = await axios.get(robohashUrl, { responseType: 'arraybuffer' });
    return response.data;
};

const saveImageToDisk = async (buffer, imagePath) => {
    await fs.writeFile(imagePath, buffer);
};

module.exports.generateRandomHero = async () => {
    const powers = [
        'Super Strength',
        'Flight',
        'Telekinesis',
        'Invisibility',
        'Teleportation',
        'Super Speed',
        'Regeneration',
        'Pyrokinesis',
        'Aquatic Adaptation',
        'Elemental Control',
    ];

    const response = await axios.get('https://randomuser.me/api');
    const data = response.data;
    const nickname = `SUPERHERO-${data.results[0].name.first} ${data.results[0].name.last}`;

    const origins = [
        'was born with their powers',
        'was exposed to radiation',
        'was bitten by a radioactive animal',
        'discovered their powers accidentally',
        'was given powers by a magical artifact',
    ];

    const phrases = [
        'I am the hero this city needs!',
        'Never fear, SuperHero is here!',
        'Time to save the day!',
        'Up, up, and away!',
        'With great power comes great responsibility.',
    ];

    const randomIndex = () => Math.floor(Math.random() * origins.length);

    const realName = `${data.results[0].name.first} ${data.results[0].name.last}`;
    const originDescription = origins[randomIndex()];
    const catchPhrase = phrases[randomIndex()];

    const numImages = Math.floor(Math.random() * 5) + 1; // случайное число изображений от 1 до 5

    const superPowers = [];
    for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * powers.length);
        superPowers.push(powers[index]);
    }

    const images = [];
    this.createPublicFolder(path.resolve(STATIC_PATH, 'images')); // создаем папку public/images, если их нет

    for (let i = 0; i < numImages; i++) {
        const imageName = `${nickname}-${Date.now()}`;
        const imagePath = path.join(STATIC_PATH, 'images', `${imageName}.png`);
        const buffer = await generateRobohash(imageName);
        await saveImageToDisk(buffer, imagePath);
        images.push(path.basename(imagePath)); // только имя файла возвращаем
    }

    return { nickname, realName, originDescription, catchPhrase, superPowers, images };
};

//this.generateRandomHero().then(hero => console.log(hero));