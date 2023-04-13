import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../../components/Hero';
import { getHeroes } from '../../redux/slices/heroSlice';
import styles from './HeroesPage.module.css';
import Modal from 'react-modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { addHero } from '../../api';
import CONSTANTS from '../../constants';

Modal.setAppElement('#root');

const validationHeroSchema = yup.object().shape({
    nickname: yup.string()
        .trim()
        .min(3, 'Nickname must be at least 3 characters')
        .required('Nickname is required'),
    realName: yup.string()
        .trim()
        .min(3, 'Real name must be at least 3 characters')
        .required('Real name is required'),
    catchPhrase: yup.string()
        .trim()
        .min(3, 'Catch phrase must be at least 3 characters')
        .required('Catch phrase is required'),
    originDescription: yup.string()
        .trim()
        .min(10, 'Origin description must be at least 10 characters')
        .required('Origin description is required'),
})

const HeroesPage = () => {
    const { heroes, totalHeroesCount, isLoading, error } = useSelector((state) => state.heroes);
    const dispatch = useDispatch();
    const [searchHero, setSearchHero] = useState('');
    const [modalAddHeroOpen, setModalAddHeroOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [maxPageNumber, setMaxPageNumber] = useState(0);
    const [prevButtonDisabled, setPrevButtonDisabled] = useState(true);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

    useEffect(() => {
        setPrevButtonDisabled(pageNumber === 0);
        setNextButtonDisabled(pageNumber === maxPageNumber - 1);
    }, [pageNumber, maxPageNumber])

    useEffect(() => {
        setMaxPageNumber(Math.ceil(totalHeroesCount / CONSTANTS.itemsPerPage));
        dispatch(getHeroes(pageNumber));
    }, [pageNumber, totalHeroesCount])

    const nextPage = () => {
        if(pageNumber < maxPageNumber - 1) {
            setPageNumber(pageNumber + 1);
        }
        setPageNumber(pageNumber + 1);
    }

    const prevPage = () => {
        if(pageNumber > 0) {
            setPageNumber(pageNumber - 1);
        }
    }

    if (isLoading) {
        return <div>LOADING</div>;
    }

    if (error) {
        return <div>ERROR</div>;
    }

    const filteredHeroes = heroes.filter((hero) =>
        hero.nickname.toLowerCase().includes(searchHero.toLowerCase())
    )

    const heroesCards = filteredHeroes.map(hero => <Hero key={hero.id} hero={hero} currentPage={pageNumber} />)

    return (
        <div>
            <button onClick={() => setModalAddHeroOpen(true)}>Add hero</button>

            <Modal
            isOpen={modalAddHeroOpen}
            onRequestClose={() => setModalAddHeroOpen(false)}
            contentLabel="Add Hero Modal"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                }
            }}
            >
                <h2>Add Hero</h2>

                <Formik
                initialValues={{
                    nickname: '',
                    realName: '',
                    catchPhrase: '',
                    originDescription: ''
                }}
                validationSchema={validationHeroSchema} 
                onSubmit={async (values, {resetForm}) => {
                    try {
                        await addHero(values);
                        dispatch(getHeroes());
                        setModalAddHeroOpen(false);
                        resetForm();
                    } catch (error) {
                        console.error(error);
                    }
                }} 
                >
                    {(props) => (
                        <Form>
                            <div>
                                <label>Nickname</label>
                                <Field name="nickname"></Field>
                                <ErrorMessage name="nickname" component="div" />
                            </div>
                            <div>
                                <label>Real Name</label>
                                <Field name="realName"></Field>
                                <ErrorMessage name="realName" component="div" />
                            </div>
                            <div>
                                <label>Catch Phrase</label>
                                <Field name="catchPhrase"></Field>
                                <ErrorMessage name="catchPhrase" component="div" />
                            </div>
                            <div>
                                <label>Origin Description</label>
                                <Field name="originDescription"></Field>
                                <ErrorMessage name="originDescription" component="div" />
                            </div>
                            <button type="submit">Add hero</button>
                            <button type="button" onClick={() => setModalAddHeroOpen(false)}>Cancel</button>
                        </Form>
                    )}
                </Formik>
            </Modal>

            <input
                type="text"
                value={searchHero}
                onChange={({ target: { value } }) => setSearchHero(value)}
                placeholder="Search by hero nickname"
            />
            {heroesCards}
            <div>
                <button onClick={prevPage} disabled={prevButtonDisabled}>Go to previous page</button>
                <button onClick={nextPage} disabled={nextButtonDisabled}>Go to next page</button>
                <p>You are on the page: {pageNumber + 1}</p>
                <p>Total number of pages: {maxPageNumber}</p>
            </div>
        </div>
    );
}

export default HeroesPage;
