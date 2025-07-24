import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import noImage from '../assets/img/noImage.jpg';
import './css/movieDetail.css';

const MovieDetail = () => {

    const [loadingDetail, setLoadingDetail] = useState(false);
    const [movieData, setMovieData] = useState(null);

    const { id } = useParams();
    
    useEffect(() => {
        setLoadingDetail(true);

        const requestMovieDetail = async (movieId) => {
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
        
        requestMovieDetail(id);

    }, [id])

    return (
        <div className={`movieDetail-div ${(!loadingDetail && movieData) && 'colored'}`}>
            {loadingDetail ? (<p> Loading...</p>) :
                (movieData ?
                    <>
                    <img className='movieDetail-backdrop' src={movieData.backdrop_path ? `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}` : noImage} alt={movieData.title ? movieData.title : 'Movie not found'} />
                    <div className='movieDetail-text p-4'>
                        <h3 className="movieDetail-title bg-warningtext-black">
                            {movieData.title}
                        </h3>
                        <p>{`(${movieData.release_date.slice(0,4)})`}</p>
                        <div className='movieDetail-genresDiv'>
                            {movieData.genres.map(genre => (<span key={genre.id}>{genre.name} </span>))}
                        </div>
                        <p>{`Runtime: ${movieData.runtime} min.`}</p>
                        <p>{movieData.overview}</p>
                    </div>
                    </>
                    : <p>No details found</p>
                )
                
            }
        </div>
    )
};

export default MovieDetail;