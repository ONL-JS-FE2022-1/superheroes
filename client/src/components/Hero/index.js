import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Hero.module.css';
import { deleteHero, deletePower, addPower, editHero, deleteImage } from '../../api';
import { getHeroes } from '../../redux/slices/heroSlice';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

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

const validationPowerSchema = yup.object().shape({
    powerName: yup.string()
        .trim()
        .min(3, 'Superpower name must be at least 3 characters')
        .required('Superpower name is required')
})


const Hero = ({ hero, currentPage, setPageNumber }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAddPowerOpen, setModalAddPowerOpen] = useState(false);
    const [modalEditHeroOpen, setModalEditHeroOpen] = useState(false);
    const [modalAddImageOpen, setModalAddImageOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const dispatch = useDispatch();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current) => {
            setCurrentSlide(current);
        }
    }

    const deleteImageHandler = async () => {
        await deleteImage(hero.id, hero.images[currentSlide].id);
        dispatch(getHeroes(currentPage));
    }

    const deleteHandler = async () => {
        await deleteHero(hero.id);
        dispatch(getHeroes(currentPage));
        setModalOpen(false);
    }

    const deletePowerHandler = async (powerId) => {
        await deletePower(hero.id, powerId);
        dispatch(getHeroes(currentPage));
    }

    const handleAddPowerSubmit = async (values, { resetForm }) => {
        try {
            await addPower(hero.id, [values.powerName]);
            dispatch(getHeroes(currentPage));
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

            <button onClick={() => setModalEditHeroOpen(true)}>Edit superhero!</button>

            {/* Модальне вікно для редагування супергероя */}
            <Modal
                isOpen={modalEditHeroOpen}
                onRequestClose={() => setModalEditHeroOpen(false)}
                contentLabel="Edit Hero Modal"
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
                <h2>Edit Hero</h2>
                <Formik
                    initialValues={{
                        nickname: hero.nickname,
                        realName: hero.realName,
                        catchPhrase: hero.catchPhrase,
                        originDescription: hero.originDescription
                    }}
                    validationSchema={validationHeroSchema}
                    onSubmit={async (values) => {
                        try {
                            await editHero(hero.id, values);
                            dispatch(getHeroes());
                            setPageNumber(0);
                            setModalEditHeroOpen(false);
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
                            <button type="submit">Save changes</button>
                            <button type="button" onClick={() => { setModalEditHeroOpen(false) }}>Cancel</button>
                        </Form>
                    )}
                </Formik>
            </Modal>

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
            <button onClick={() => { setModalAddPowerOpen(true) }}>Add superpower</button>

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

            <button onClick={() => setModalAddImageOpen(true)}>Add image(s)</button>

            {/* Модальне вікно для додавання зображень */}
            <Modal
                isOpen={modalAddImageOpen}
                onRequestClose={() => setModalAddImageOpen(false)}
                contentLabel="Add Image Modal"
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
                <h2>Add Image</h2>
                <Formik
                    initialValues={{ images: [] }}
                    onSubmit={async (values, { setSubmitting }) => {
                        const formData = new FormData();
                        values.images.forEach((file) => {
                            formData.append("images", file);
                        });
                        try {
                            const response = await fetch(`http://localhost:5000/api/superheroes/${hero.id}/images`, {
                                method: 'POST',
                                body: formData
                            })
                            if (response.ok) {
                                console.log('Image uploaded successfully');
                                dispatch(getHeroes(currentPage));
                            } else {
                                console.error('Failed to upload image');
                            }
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <Form>
                            <div>
                                <label>Images: </label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    multiple
                                    accept="image/*"
                                    onChange={(event) => {
                                        const files = [...event.target.files];
                                        if (files.length > 10) {
                                            alert('You can select up to 10 images.');
                                            setFieldValue("images", []);
                                        } else {
                                            setFieldValue("images", files);
                                        }
                                    }}
                                />
                                <ErrorMessage name="images" component="div" />
                            </div>
                            <button type="submit" disabled={isSubmitting}>Upload image(s)</button>
                            <button type="button" onClick={() => setModalAddImageOpen(false)}>Cancel</button>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {hero.images.length > 0 && <button onClick={deleteImageHandler}>Delete current image in the slider</button>}
        </article>
    );
}

export default Hero;
