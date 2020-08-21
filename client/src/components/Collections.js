import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Context} from './Context'
import Loading from "../images/loading.gif";

const Collections = () => {

    const {accessToken, setAccessToken} = useContext(Context);
    const {googleAccessToken, setGoogleAccessToken} = useContext(Context);

    const {ACCESS_KEY} = useContext(Context);
    const {fetching, setFetching} = useContext(Context);
    const {images, setImages} = useContext(Context);

    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(false);

    const [linkCopyShow, setLinkCopyShow] = useState(false);
    const [deleteImageShow, setDeleteImageShow] = useState(false);

    useEffect( () => {
        getCollections();
        console.log(accessToken);

    }, [])

    const getCollections = async () => {
        await axios.all([
            await axios.get(`https://api.unsplash.com/search/photos/?page=1&per_page=250&query=San+Francisco&client_id=${ACCESS_KEY}`),
            await axios.get(`https://api.unsplash.com/search/photos/?page=2&per_page=250&query=San+Francisco&client_id=${ACCESS_KEY}`),
            await axios.get(`https://api.unsplash.com/search/photos/?page=3&per_page=250&query=San+Francisco&client_id=${ACCESS_KEY}`),
            await axios.get(`https://api.unsplash.com/search/photos/?page=4&per_page=250&query=San+Francisco&client_id=${ACCESS_KEY}`)
        ])
            .then(
                axios.spread((...responses) => {
                    console.log(responses[0])
                    console.log([...responses[0].data.results, ...responses[1].data.results, ...responses[2].data.results, ...responses[3].data.results])
                    setImages([...responses[0].data.results, ...responses[1].data.results, ...responses[2].data.results, ...responses[3].data.results])
                })
            )
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

    return (
        <>

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
                                        <button className="card-button btn btn-danger" style={{color: "red"}} onClick={showDeleteImageModal} data-tip='Remove From Collections'>
                                            <i className="fas fa-times"></i>
                                        </button>

                                        <button className="card-button btn btn-primary copy-image" onClick={() => download(image.urls.raw, image.description + '.png')}>
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
                                            <button className="card-button btn btn-primary" onClick={showDeleteImageModal}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                            <button className="card-button btn btn-primary copy-image" onClick={() => download(image.urls.raw, image.description + '.png')}>
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

export default Collections;