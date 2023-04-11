import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Hero from '../../components/Hero';
import {getHeroes} from '../../redux/slices/heroSlice';
import styles from './HeroesPage.module.css';

const HeroesPage = () => {
    const {heroes, isLoading, error} = useSelector((state) => state.heroes);
    const dispatch = useDispatch();
    const [searchHero, setSearchHero] = useState('');

    useEffect(() => {
        dispatch(getHeroes());
    }, [])

    if(isLoading) {
        return <div>LOADING</div>;
    }

    if(error) {
        return <div>ERROR</div>;
    }

    const filteredHeroes = heroes.filter((hero) => 
        hero.nickname.toLowerCase().includes(searchHero.toLowerCase())
    )

    const heroesCards = filteredHeroes.map(hero => <Hero key={hero.id} hero={hero} />)

    return (
        <div>
            <input 
            type="text" 
            value={searchHero} 
            onChange={({target: {value}}) => setSearchHero(value)} 
            placeholder="Search by hero nickname" 
            />
            {heroesCards}
        </div>
    );
}

export default HeroesPage;
