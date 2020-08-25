import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Context} from './Context'
import Loading from "../images/loading.gif";
import Downloading from "../images/downloading.gif";

const Collections = () => {

    const {PIXABAY_KEY} = useContext(Context);
    const {fetching, setFetching} = useContext(Context);
    const [images, setImages] = useState([])
    const {search, setSearch} = useContext(Context);

    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(false);

    const [linkCopyShow, setLinkCopyShow] = useState(false);
    const [deleteImageShow, setDeleteImageShow] = useState(false);

    const [myBackground, setMyBackground] = useState('');

    const colorSearch = [
        'red','orange','green','turquoise','blue','lilac','pink'
    ];

    useEffect( () => {
        getCollections();
        getWallpaper();
    }, [])

    const getCollections = async () => {
        setFetching(true);
        let headers;
        if (localStorage.getItem('auth-token')) {
            headers = {
                headers: {
                    'auth-token': localStorage.getItem('auth-token')
                }
            };
        };
        if (localStorage.getItem('google-auth-token')) {
            headers = {
                headers: {
                    'google-auth-token': localStorage.getItem('google-auth-token'),
                    'email' : localStorage.getItem('google-email')
                }
            };
        };

        await axios.get('/collections/get', headers)
            .then(res => {
                // console.log(res)
                console.log('Images Retrieved')
                setImages(res.data)
                setFetching(false)
            })
            .catch(err => console.log(err))
        setFetching(false)
    }

    const deletePhoto = async (id) => {
        let headers;
        if (localStorage.getItem('auth-token')) {
            headers = {
                headers: {
                    'auth-token': localStorage.getItem('auth-token')
                }
            };
        };
        if (localStorage.getItem('google-auth-token')) {
            headers = {
                headers: {
                    'google-auth-token': localStorage.getItem('google-auth-token'),
                    'email' : localStorage.getItem('google-email')
                }
            };
        };
        await axios.delete('/collections/' + id, headers)
            .then(res => {
                // console.log(res)
                console.log('Image Deleted')
                setImages( images.filter( image => image.photoID !== id));
                showDeleteImageModal()
            })
            .catch(err => console.log(err))
    };

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

    const showLinkCopyModal = () => {
        setLinkCopyShow(true);
        setTimeout(() => {
            setLinkCopyShow(false);
        }, 700);
    };
    const showDeleteImageModal = () => {
        setDeleteImageShow(true);
        setTimeout(() => {
            setDeleteImageShow(false);
        }, 700);
    };
    const showImageViewModal = (imageURL) => {
        document.querySelector(`.${imageURL}`).style = null
    };

    const closeImageViewModal = (imageURL) => {
        document.querySelector(`.${imageURL}`).style.display = 'none'
    }

    const getWallpaper = async (e) => {
        await axios.get(`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=color&per_page=200&colors=${Math.floor(Math.random() * colorSearch.length)}&orientation=horizontal&image_type=photo`)
            .then(response => {
                // console.log(response.data.hits)
                setMyBackground(response.data.hits[Math.floor(Math.random() * response.data.hits.length)].largeImageURL)
            })
            .catch(err => console.log(err))
    }

    const getSearch = async (e) => {
        sessionStorage.setItem('search', search)
        e.preventDefault();
        window.location.href=('/search')
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    return (
        <>
            {
                (localStorage.getItem('auth-token') === null && localStorage.getItem('google-auth-token') === null)
                ?

                    <div className="jumbotron jumbotron-fluid h-100 d-flex flex-column align-items-center justify-content-center w-100" style={{backgroundImage: `url(${myBackground})`}}>
                        <h1 className="display-4 text-center">pix</h1>
                        <p className='lead text-center'>You must register and login to view your collections.</p>
                        <div className='d-flex w-100 justify-content-center'>
                            <a className="btn btn-primary mr-2" href="/register">register</a>
                            <a className="btn btn-primary ml-2" href="/login">login</a>
                        </div>
                    </div>

                : <>

                    {
                        linkCopyShow
                        ? <div id='modal'>Link Copied!</div>
                        : ''
                    }

                    {
                        deleteImageShow
                        ? <div id='modal'>Image Deleted</div>
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
                        downloading
                            ? <div className='downloading'>
                                <img src={Downloading} alt='downloading'/>
                            </div>
                            : ''
                    }

                    {
                        images.length === 0
                        ? fetching
                            ? null
                            :
                            <>
                                <div className="jumbotron jumbotron-fluid h-100 d-flex flex-column align-items-center justify-content-center w-100" style={{backgroundImage: `url(${myBackground})`}}>
                                    <h1 className="display-4 text-center">Collection Empty</h1>
                                    <p className='lead text-center'>Try searching for some photos</p>
                                    <form className="form-inline mt-3 mb-3 search-form has-search justify-content-center w-100" onSubmit={getSearch}>
                                        <input className="form-control mr-2 home-search-bar" type="search" placeholder="Search for free high-resolution photos" aria-label="Search"  onChange={handleSearch} value={search} />
                                        <button className="btn btn-primary my-2 my-sm-0 search-button" type="submit"><i className="fas fa-search"></i></button>
                                    </form>
                                </div>
                            </>
                        : fetching ? null :
                        <div className='image-container mt-4'>
                        {
                            images.map(image =>
                                <div className='image-card' key={image.photoID}>
                                    <img className='image' src={image.urlsSmall} alt={image.altDescription}
                                         srcSet={`${image.urlsRegular} 1200w, ${image.urlsSmall} 768w, ${image.urlsSmall} 400w, ${image.urlsThumb} 200w`}
                                    />
                                    <div className="card-img-overlay">
                                        <button className="card-button btn btn-danger" style={{color: "red"}}
                                                onClick={() => deletePhoto(image.photoID)}>
                                            <i className="fas fa-times"></i>
                                        </button>

                                        <button className="card-button btn btn-primary copy-image"
                                                onClick={() => download(image.urlsRaw, image.altDescription + '.png')}>
                                            <i className="fas fa-arrow-down"></i>
                                        </button>

                                        <CopyToClipboard text={image.urlsRaw}>
                                            <button className="card-button btn btn-primary" onClick={showLinkCopyModal}>
                                                <i className="fas fa-share"></i>
                                            </button>
                                        </CopyToClipboard>

                                        <button className="card-button btn btn-primary view-image"
                                                onClick={() => showImageViewModal(`dc${image.photoID}`)}>
                                            <i className="fas fa-search"></i>
                                        </button>

                                    </div>

                                    <div id='image-modal' className={`dc${image.photoID}`} style={{display: "none"}}>
                                                    <span className='modal-buttons'>
                                                        <button className="card-button btn btn-danger" style={{color: "red"}}
                                                                onClick={() => closeImageViewModal(`dc${image.photoID}`)}>
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                        <button className="card-button btn btn-primary copy-image"
                                                                onClick={() => download(image.urlsRaw, image.altDescription + '.png')}>
                                                        <i className="fas fa-arrow-down"></i>
                                                        </button>
                                                        <CopyToClipboard text={image.urlsRaw}>
                                                        <button className="card-button btn btn-primary"
                                                                onClick={showLinkCopyModal}>
                                                            <i className="fas fa-share"></i>
                                                        </button>
                                                        </CopyToClipboard>
                                                    </span>
                                        <img src={image.urlsRegular} onClick={() => closeImageViewModal(`dc${image.photoID}`)}
                                             alt={image.altDescription}/>
                                    </div>
                                </div>
                            )
                        }
                        </div>
                    }
                </>
            }
        </>
    )
}

export default Collections;