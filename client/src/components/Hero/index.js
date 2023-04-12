import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Hero.module.css';
import { deleteHero, deletePower, addPower } from '../../api';
import { getHeroes } from '../../redux/slices/heroSlice';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

Modal.setAppElement('#root');

const validationPowerSchema = yup.object().shape({
    powerName: yup.string()
        .trim()
        .min(3, 'Superpower name must be at least 3 characters')
        .required('Superpower name is required')
})


const Hero = ({ hero }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAddPowerOpen, setModalAddPowerOpen] = useState(false);

    const dispatch = useDispatch();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    const deleteHandler = async () => {
        await deleteHero(hero.id);
        dispatch(getHeroes());
        setModalOpen(false);
    }

    const deletePowerHandler = async (powerId) => {
        await deletePower(hero.id, powerId);
        dispatch(getHeroes());
        setModalOpen(false);
    }

    const handleAddPowerSubmit = async (values, {resetForm}) => {
        try {
            await addPower(hero.id, [values.powerName]);
            dispatch(getHeroes());
            setModalAddPowerOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <article>
            <h1>{hero.nickname}</h1>
            <h2>Also known as {hero.realName}</h2>
            <Slider {...settings} style={{ width: "20%", margin: "30px" }}>
                {hero.images.map((image) => (
                    <img
                        key={image.id}
                        src={`http://localhost:5000/images/${image.path}`}
                        alt={hero.nickname}
                    />
                ))}
            </Slider>

            <p>Catch phrase: {hero.catchPhrase}</p>
            <p>Origin description</p>
            <p>{hero.originDescription}</p>
            <p>Superpowers</p>
            <ul>
                {hero.superPowers.map((power) => (
                    <table>
                        <tr>
                            <td>
                                <li key={power.id}>{power.name}</li>
                            </td>
                            <td>
                                <button onClick={() => deletePowerHandler(power.id)}>Delete power!</button>
                            </td>
                        </tr>
                    </table>
                ))}
            </ul>

            <button onClick={() => setModalOpen(true)}>Delete superhero!</button>

            {/* Модальне вікно для підтвердження видалення */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Delete Hero Modal"
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
                <h2>Delete Hero</h2>
                <p>Are you sure you want to delete {hero.nickname}?</p>
                {/* Підтвердження видалення */}
                <button onClick={deleteHandler}>Yes</button>
                <button onClick={() => setModalOpen(false)}>No</button>
            </Modal>


            {/* Додавання суперсили */}
            <button onClick={() => {setModalAddPowerOpen(true)}}>Add superpower</button>

            <Modal
                isOpen={modalAddPowerOpen}
                onRequestClose={() => setModalAddPowerOpen(false)}
                contentLabel="Add Superpower Modal"
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
                <h2>Add superpower</h2>

                <Formik
                    initialValues={{ powerName: '' }}
                    validationSchema={validationPowerSchema}
                    onSubmit={handleAddPowerSubmit}
                >
                    {(props) => (
                        <Form>
                            <label>
                                Superpower Name:
                                <Field type="text" name="powerName" />
                                <ErrorMessage name="powerName" />
                            </label>

                            <button type="submit">Add</button>
                            <button type="button" onClick={() => setModalAddPowerOpen(false)}>Cancel</button>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </article>
    );
}

export default Hero;
