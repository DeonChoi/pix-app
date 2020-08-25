import React, {useEffect, useState} from 'react';
import {Context} from "./components/Context";

import './App.css';

import {BrowserRouter as Router, Link, Route} from "react-router-dom";

import Home from "./components/Home";
import Search from "./components/Search";
import Collections from "./components/Collections";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";

import Logo from './images/logo.png';

const App = () => {

    useEffect( () => {
        const topButton = document.getElementById("topButton");
        window.addEventListener('scroll', () => {
            if (window.scrollY > 2000) {
                topButton.style.display = "block";
            } else {
                topButton.style.display = "none";
            }
        })
    }, [])

    const [images, setImages] = useState([])
    const [search, setSearch] = useState(sessionStorage.getItem('search') ? sessionStorage.getItem('search') : '')
    const [lastSearch, setLastSearch] = useState();
    const [fetching, setFetching] = useState(false);

    const PIXABAY_KEY = '17990511-4817078a8e0b7192cbe1dc270';
    const ACCESS_KEY = 'IJ1yZh7pdWGg1Xf_GDvalE5UdrAOJJAUmCeyhS8BmoA';
    const GOOGLE_CLIENT_ID = `743017633638-hm8ik5mcrkpu1kstfjdajacs7m8mrsav.apps.googleusercontent.com`


    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const getSearch = async (e) => {
        sessionStorage.setItem('search', search)
        e.preventDefault();
        window.location.href=('/search')
    }

    const goToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

  return (

        <Router basename={'/'}>
            <header>

                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link to={'/'} className="text-primary mr-5 navbar-brand-link">
                        <img src={Logo} alt="" className='navbar-brand' height='45'/>
                        pix
                    </Link>

                    <form className="form-inline mt-3 mb-3 search-form has-search justify-content-center" onSubmit={getSearch}>
                        <input className="form-control search-bar" type="search" placeholder="Search photos" aria-label="Search" onChange={handleSearch} value={search} />
                        <button className="btn btn-outline-primary my-2 my-sm-0 search-button" type="submit"><i className="fas fa-search"></i></button>
                    </form>

                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {
                        (localStorage.getItem('auth-token') !== null || localStorage.getItem('google-auth-token') !== null)
                        ?
                        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{justifyContent:"flex-end"}}>
                            <Link to={'/collections'} className="nav-link text-primary">collections <span className="sr-only">(current)</span></Link>
                            <div className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {localStorage.getItem('google-email') || localStorage.getItem('email')}
                                </Link>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <Link to={'/logout'} className="nav-link text-primary d-flex justify-content-center">logout <span className="sr-only">(current)</span></Link>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{justifyContent:"flex-end"}}>
                            <Link to={'/collections'} className="nav-link text-primary">collections <span className="sr-only">(current)</span></Link>
                            <Link to={'/register'} className="nav-link text-primary">register <span className="sr-only">(current)</span></Link>
                            <Link to={'/login'} className="nav-link text-primary">login <span className="sr-only">(current)</span></Link>
                        </div>
                    }


                </nav>

            </header>

            <main>
                <Context.Provider value={{
                    images, setImages,
                    search, setSearch,
                    lastSearch, setLastSearch,
                    fetching, setFetching,
                    ACCESS_KEY, PIXABAY_KEY,
                    GOOGLE_CLIENT_ID
                }}>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/search' component={Search} />
                    <Route path='/collections' component={Collections} />
                    <Route path='/register' component={Register} />
                    <Route path='/login' component={Login} />
                    <Route path='/logout' component={Logout} />
                </Context.Provider>

                <button onClick={goToTop} id='topButton' className='btn btn-primary' title='Go To Top'>
                    <i className="fas fa-arrow-up"></i>
                </button>
            </main>
        </Router>
  );
}

export default App;