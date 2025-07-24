import { useState, useEffect } from 'react';
import axios from 'axios';
import notFound from '../assets/img/notFound.jpg';
import './css/movieDetail.css';

const MovieDetail = ({id, setShowChosenMovie, setSelectedGenre, setSelectedGenreName}) => {

    const [loadingDetail, setLoadingDetail] = useState(false);
    const [movieData, setMovieData] = useState(null);

    const requestMovieDetail = async (movieId) => {
        setLoadingDetail(true);
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=images`, {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}` }
            });
            if (res.status !== 200) return alert(`Error: ${res.statusText}`);

            setMovieData(res.data);

        } catch (err) {
            return alert('Error getting movie detail');
        } finally {
            setLoadingDetail(false);
        };
    }

    useEffect(() => {
        requestMovieDetail(id);
    }, [id]);

    return (
        <div className='movieDetail-extDiv'>
            <div className={`movieDetail-intDiv ${loadingDetail && 'align-items-center justify-content-center'}`}>
            
            {loadingDetail ? (<p> Loading...</p>) :
                (movieData ?
                    <>
                        <button
                        className='movieDetail-closeBtn p-2 ps-3'
                        type='button'
                        onClick={() => setShowChosenMovie(false)}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div className='movieDetail-imgDiv'>
                            <img
                                src={movieData.backdrop_path ? `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}` : notFound}
                                alt={movieData.title}
                                className="movieDetail-img w-100"
                            />
                            <h3 className="movieDetail-title ps-4">
                                {movieData.title}
                            </h3>
                            <div className="movieDetail-gradientOverlay"></div>
                        </div>
                            <div className='movieDetail-overviewDiv ps-4 pe-4 pt-2 pb-2'>
                            <p><span>{`${movieData.release_date.slice(0, 4)}`}, </span>{`${movieData.runtime} min.`}<span></span></p>
                            <div className='movieDetail-genresDiv'>
                                {movieData.genres.map(genre => (
                                    <button
                                        key={genre.id}
                                        className='movieDetail-genreBtn btn me-2 mb-3'
                                        onClick={() => {
                                            setShowChosenMovie(false);
                                            setSelectedGenre(genre.id);
                                            setSelectedGenreName(genre.name);
                                        }}>
                                        {genre.name}
                                    </button>))}
                            </div>
                            <p>{movieData.overview}</p>
                        </div>
                    </>
                    : <p>No details found</p>
                )}
            </div>
        </div>
    )
};

export default MovieDetail;