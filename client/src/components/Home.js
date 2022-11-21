import React, { useContext, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Loading from "../images/loading.gif";
import Downloading from "../images/downloading.gif";

import { Context } from "./Context";

import "../styles/Home.css";

import axios from "axios";

const Home = () => {
	const defaultSearchTerms = [
		"Mexico City",
		"Washington D.C.",
		"London",
		"New York City",
		"Paris",
		"Amsterdam",
		"San Francisco",
		"Los Angeles",
		"Seoul",
	];
	const colorSearch = [
		"red",
		"orange",
		"green",
		"turquoise",
		"blue",
		"lilac",
		"pink",
	];

	const { PIXABAY_KEY } = useContext(Context);
	const { ACCESS_KEY } = useContext(Context);
	const { fetching, setFetching } = useContext(Context);
	const { images, setImages } = useContext(Context);

	const [downloading, setDownloading] = useState(false);
	const [error, setError] = useState(false);

	const [linkCopyShow, setLinkCopyShow] = useState(false);
	const [imageSaveShow, setImageSaveShow] = useState(false);

	const [search, setSearch] = useState(
		defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)]
	);
	const [myBackground, setMyBackground] = useState("");

	const [saveModalMessage, setSaveModalMessage] = useState("");

	useEffect(() => {
		getDefault();
		getWallpaper();
	}, []);

	const showLinkCopyModal = () => {
		setLinkCopyShow(true);
		setTimeout(() => {
			setLinkCopyShow(false);
		}, 2000);
	};
	const showImageSaveModal = () => {
		setImageSaveShow(true);
		setTimeout(() => {
			setImageSaveShow(false);
		}, 2000);
	};
	const showImageViewModal = (imageURL) => {
		document.querySelector(`.${imageURL}`).style = null;
	};

	const closeImageViewModal = (imageURL) => {
		document.querySelector(`.${imageURL}`).style.display = "none";
	};

	const saveImage = async (e) => {
		e.preventDefault();

		if (localStorage.getItem("auth-token") === null) {
			setSaveModalMessage("Login to save photos to collections");
			showImageSaveModal();
			return;
		} else {
			const newPhoto = {
				photoID: e.target.getAttribute("data-photoid"),
				altDescription: e.target.getAttribute("data-altdescription") || "",
				urlsSmall: e.target.getAttribute("data-urlssmall"),
				urlsRegular: e.target.getAttribute("data-urlsregular"),
				urlsThumb: e.target.getAttribute("data-urlsthumb"),
				urlsRaw: e.target.getAttribute("data-urlsraw"),
			};

			let headers;
			if (localStorage.getItem("auth-token")) {
				headers = {
					headers: {
						"auth-token": localStorage.getItem("auth-token"),
					},
				};
			}

			await axios
				.post(`/collections/add`, newPhoto, headers)
				.then((res) => {
					console.log("Image Saved");
					setSaveModalMessage(res.data);
					showImageSaveModal();
				})
				.catch((err) => console.log(err));
		}
	};

	const getDefault = async (e) => {
		setFetching(true);

		await axios
			.all([
				await axios.get(
					`https://api.unsplash.com/search/photos/?page=1&per_page=250&query=${search}&client_id=${ACCESS_KEY}`
				),
				await axios.get(
					`https://api.unsplash.com/search/photos/?page=2&per_page=250&query=${search}&client_id=${ACCESS_KEY}`
				),
			])
			.then(
				axios.spread((...responses) => {
					setImages([
						...responses[0].data.results,
						...responses[1].data.results,
					]);
					setFetching(false);
				})
			)
			.catch((err) => console.log(err));
		setFetching(false);
	};

	const getWallpaper = async (e) => {
		await axios
			.get(
				`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=color&per_page=200&colors=${Math.floor(
					Math.random() * colorSearch.length
				)}&orientation=horizontal&image_type=photo`
			)
			.then((response) => {
				setMyBackground(
					response.data.hits[
						Math.floor(Math.random() * response.data.hits.length)
					].largeImageURL
				);
			})
			.catch((err) => console.log(err));
	};

	const handleSearch = (e) => {
		setSearch(e.target.value);
	};

	const getSearch = async (e) => {
		sessionStorage.setItem("search", search);
		e.preventDefault();
		window.location.href = "/search";
	};

	const download = (url, name) => {
		if (!url) {
			throw new Error("Resource URL not provided! You need to provide one");
		}
		setDownloading(true);
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
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
			<div
				className="jumbotron jumbotron-fluid d-flex flex-column align-items-center justify-content-center w-100"
				style={{ backgroundImage: `url(${myBackground})` }}>
				<h1 className="display-4 text-center">pix</h1>
				<p className="lead text-center">
					Search for free high-resolution photos.
				</p>

				{localStorage.getItem("auth-token") === null && (
					<>
						<p>Register and login to save photos to your collections.</p>
						<div className="d-flex w-100 justify-content-center">
							<a className="btn btn-primary mr-2" href="/register">
								register
							</a>
							<a className="btn btn-primary ml-2" href="/login">
								login
							</a>
						</div>
					</>
				)}
				<form
					className="form-inline mt-3 mb-3 search-form has-search justify-content-center w-100"
					onSubmit={getSearch}>
					<input
						className="form-control mr-2 home-search-bar"
						type="search"
						placeholder="Search for free high-resolution photos"
						aria-label="Search"
						onChange={handleSearch}
						value={search}
					/>
					<button
						className="btn btn-primary my-2 my-sm-0 search-button"
						type="submit">
						<i className="fas fa-search"></i>
					</button>
				</form>
			</div>

			{linkCopyShow ? <div id="modal">Link Copied!</div> : ""}

			{imageSaveShow ? (
				// ? <div id='modal'>Image Saved</div>
				<div id="modal">{saveModalMessage}</div>
			) : (
				""
			)}

			{fetching ? (
				<div className="loading">
					<img src={Loading} alt="loading" />
				</div>
			) : null}

			{downloading ? (
				<div className="downloading">
					<img src={Downloading} alt="downloading" />
				</div>
			) : (
				""
			)}

			{images.length === 0 ? (
				fetching ? null : (
					<div>
						<h1 className="no-results text-center mt-5">No Results Found</h1>
						<h3 className="text-center">Try another search</h3>
					</div>
				)
			) : fetching ? null : (
				<div className="image-container mt-4">
					{images.map((image) => (
						<div className="image-card" key={image.id}>
							<img
								className="image"
								src={image.urls.small}
								alt={image.alt_description}
								srcSet={`${image.urls.regular} 1200w, ${image.urls.small} 768w, ${image.urls.small} 400w, ${image.urls.thumb} 200w`}
							/>
							<div className="card-img-overlay">
								<button
									className="card-button btn btn-primary"
									onClick={saveImage}
									data-tip="Save To Collections"
									data-photoid={image.id}
									data-userid={""}
									data-altdescription={image.alt_description}
									data-urlssmall={image.urls.small}
									data-urlsraw={image.urls.raw}
									data-urlsregular={image.urls.regular}
									data-urlsthumb={image.urls.thumb}>
									<i
										className="fas fa-plus"
										data-photoid={image.id}
										data-userid={""}
										data-altdescription={image.alt_description}
										data-urlssmall={image.urls.small}
										data-urlsraw={image.urls.raw}
										data-urlsregular={image.urls.regular}
										data-urlsthumb={image.urls.thumb}></i>
								</button>

								<button
									className="card-button btn btn-primary copy-image"
									onClick={() => download(image.urls.raw, `${search}.png`)}>
									<i className="fas fa-arrow-down"></i>
								</button>

								<CopyToClipboard text={image.urls.raw}>
									<button
										className="card-button btn btn-primary"
										onClick={showLinkCopyModal}>
										<i className="fas fa-share"></i>
									</button>
								</CopyToClipboard>

								<button
									className="card-button btn btn-primary view-image"
									onClick={() => showImageViewModal(`dc${image.id}`)}>
									<i className="fas fa-search"></i>
								</button>
							</div>

							<div
								id="image-modal"
								className={`dc${image.id}`}
								style={{ display: "none" }}>
								<span className="modal-buttons">
									<button
										className="card-button btn btn-danger"
										style={{ color: "red" }}
										onClick={() => closeImageViewModal(`dc${image.id}`)}>
										<i className="fas fa-times"></i>
									</button>
									<button
										className="card-button btn btn-primary"
										onClick={saveImage}
										data-photoid={image.id}
										data-userid={""}
										data-altdescription={image.alt_description}
										data-urlssmall={image.urls.small}
										data-urlsraw={image.urls.raw}
										data-urlsregular={image.urls.regular}
										data-urlsthumb={image.urls.thumb}>
										<i
											className="fas fa-plus"
											data-photoid={image.id}
											data-userid={""}
											data-altdescription={image.alt_description}
											data-urlssmall={image.urls.small}
											data-urlsraw={image.urls.raw}
											data-urlsregular={image.urls.regular}
											data-urlsthumb={image.urls.thumb}></i>
									</button>
									<button
										className="card-button btn btn-primary copy-image"
										onClick={() => download(image.urls.raw, `${search}.png`)}>
										<i className="fas fa-arrow-down"></i>
									</button>
									<CopyToClipboard text={image.urls.raw}>
										<button
											className="card-button btn btn-primary"
											onClick={showLinkCopyModal}>
											<i className="fas fa-share"></i>
										</button>
									</CopyToClipboard>
								</span>
								<img
									src={image.urls.regular}
									onClick={() => closeImageViewModal(`dc${image.id}`)}
									alt={image.alt_description}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default Home;
