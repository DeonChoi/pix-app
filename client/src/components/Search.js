import React, {useContext, useEffect, useState} from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Loading from '../images/loading.gif';
import {Context} from './Context'

import '../styles/Home.css';

import axios from 'axios';

const Search = () => {

    const {accessToken, setAccessToken} = useContext(Context);
    const {googleAccessToken, setGoogleAccessToken} = useContext(Context);

    const {ACCESS_KEY} = useContext(Context);
    // const SECRET_KEY = 'bJpAoKrCybwlHwx9dpTvdSQWuWPVbFehyVS_MiGXbmU';
    const {fetching, setFetching} = useContext(Context);
    const {images, setImages} = useContext(Context);
    const {search, setSearch} = useContext(Context);
    const {lastSearch, setLastSearch} = useContext(Context);

    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(false);

    const [linkCopyShow, setLinkCopyShow] = useState(false);
    const [imageSaveShow, setImageSaveShow] = useState(false);

    useEffect( () => {
        getSearch();
    }, [])

    const showLinkCopyModal = () => {
        setLinkCopyShow(true);
        setTimeout(() => {
            setLinkCopyShow(false);
        }, 850);
    };
    const showImageSaveModal = () => {
        setImageSaveShow(true);
        setTimeout(() => {
            setImageSaveShow(false);
        }, 700);
    };
    const showImageViewModal = (imageURL) => {
        document.querySelector(`.${imageURL}`).style = null
    };

    const closeImageViewModal = (imageURL) => {
        document.querySelector(`.${imageURL}`).style.display = 'none'
    }

    const getSearch = async () => {
        setFetching(true)

        await axios.all([
            await axios.get(`https://api.unsplash.com/search/photos/?page=1&per_page=250&query=${search}&client_id=${ACCESS_KEY}`),
            await axios.get(`https://api.unsplash.com/search/photos/?page=2&per_page=250&query=${search}&client_id=${ACCESS_KEY}`),
            await axios.get(`https://api.unsplash.com/search/photos/?page=3&per_page=250&query=${search}&client_id=${ACCESS_KEY}`)
        ])
            .then(
                axios.spread((...responses) => {
                    console.log([...responses[0].data.results, ...responses[1].data.results, ...responses[2].data.results])
                    setImages([...responses[0].data.results, ...responses[1].data.results, ...responses[2].data.results])
                    setLastSearch(search)
                    setSearch('')
                    sessionStorage.removeItem('search' )
                    setFetching(false)
                })
            )
            .catch(err => console.log(err))
        setFetching(false)
    }

    const download = (url, name) => {

        if (!url) {
            throw new Error("Resource URL not provided! You need to provide one");
        }
        setDownloading(true);
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                setDownloading(false);
                const blobURL = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobURL;
                a.style = "display: none";

                if (name && name.length) a.download = name;
                document.body.appendChild(a);
                a.click();
            })
            .catch(() => setError(true));
    };

    return (
        <>
            {
                linkCopyShow
                    ? <div id='modal'>Link Copied!</div>
                    : ''
            }

            {
                imageSaveShow
                    ? <div id='modal'>Image Saved</div>
                    : ''
            }

            {
                fetching
                    ? <div className='loading'>
                        <img src={Loading} alt='loading'/>
                    </div>
                    : null
            }

            {
                images.length === 0
                    ? fetching ? null : <div><h1 className='no-results text-center mt-5'>No Results Found</h1><h3 className='text-center'>Try another search</h3></div>
                    : fetching ? null :
                    <div className='image-container mt-4'>
                        {
                            images.map( image =>
                                <div className='image-card' key={image.id}>
                                    <img className='image' src={image.urls.small} alt={image.alt_description}
                                         srcSet={`${image.urls.regular} 1200w, ${image.urls.small} 768w, ${image.urls.small} 400w, ${image.urls.thumb} 200w`}
                                    />
                                    <div className="card-img-overlay">
                                        <button className="card-button btn btn-primary" onClick={showImageSaveModal} data-tip='Save To Collections'>
                                            <i className="fas fa-plus"></i>
                                        </button>

                                        <button className="card-button btn btn-primary copy-image" onClick={() => download(image.urls.raw, lastSearch + '.png')}>
                                            <i className="fas fa-arrow-down"></i>
                                        </button>

                                        <CopyToClipboard text={image.urls.raw}>
                                            <button className="card-button btn btn-primary" onClick={showLinkCopyModal}>
                                                <i className="fas fa-share"></i>
                                            </button>
                                        </CopyToClipboard>

                                        <button className="card-button btn btn-primary view-image" onClick={() => showImageViewModal(`dc${image.id}`)}>
                                            <i className="fas fa-search"></i>
                                        </button>

                                    </div>

                                    <div id='image-modal' className={`dc${image.id}`} style={{display:"none"}}>
                                        <span className='modal-buttons'>
                                            <button className="card-button btn btn-danger" style={{color: "red"}} onClick={() => closeImageViewModal(`dc${image.id}`)}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <button className="card-button btn btn-primary" onClick={showImageSaveModal}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                            <button className="card-button btn btn-primary copy-image" onClick={() => download(image.urls.raw, sessionStorage.getItem('search') + '.png')}>
                                            <i className="fas fa-arrow-down"></i>
                                            </button>
                                            <CopyToClipboard text={image.urls.raw}>
                                            <button className="card-button btn btn-primary" onClick={showLinkCopyModal}>
                                                <i className="fas fa-share"></i>
                                            </button>
                                            </CopyToClipboard>
                                        </span>
                                        <img src={image.urls.regular} onClick={() => closeImageViewModal(`dc${image.id}`)} alt={image.alt_description}/>
                                    </div>
                                </div>

                            )
                        }
                    </div>
            }
        </>
    )
}

export default Search;