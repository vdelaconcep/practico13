import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import noImage from '../assets/img/noImage.jpg';
import './css/list.css'

const List = ({filter, filterName}) => {

    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [isMore, setIsMore] = useState(true);
    const lastElementRef = useRef();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Reseteo al cambiar el filtro de búsqueda
    useEffect(() => {
        setData(null);
        setPage(1);
        setIsMore(true);
    }, [filter]);

    // Pedir datos a la API al cambiar filtro de búsqueda o pasar de página
    useEffect(() => {
        request();
    }, [filter, page]);

    // Para observar el último elemento (fin de página) y que dispare la página siguiente
    useEffect(() => {
        if (loading || !isMore) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) setPage(prev => prev + 1);
        }, { threshold: 1.0 });

        if (lastElementRef.current) observer.observe(lastElementRef.current);

        return () => observer.disconnect();
    }, [loading, isMore]);

    // Petición y guardado de datos en la variable "data"
    const request = async () => {
        // Sale si no quedan más páginas
        if (!isMore) return;

        setLoading(true);
        try {
            const res = await axios.get(`https://api.themoviedb.org/3${filter || '/movie/popular?'}page=${page}`, {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}` }
            });
            if (res.status !== 200) return alert(`Error: ${res.statusText}`);
            
            setData(prev => {
                if (!prev) return res.data;

                // para que no repita películas presentes en páginas anteriores
                const allResults = [...prev.results, ...res.data.results];
                const uniqueResults = allResults.filter((movie, index, self) =>
                    index === self.findIndex(m => m.id === movie.id)
                );

                return {
                    ...res.data,
                    results: uniqueResults
                };
            });

            // setear isMore si no quedan más páginas
            if (page >= res.data.total_pages || res.data.results.length === 0) setIsMore(false);
            return;

        } catch (err) {
            alert(`Error: ${err.message}`);
            setData(null);
            setIsMore(false);
            return;
        } finally {
            setLoading(false);
        };
    };

    const listTitle = filterName ? filterName : 'Popular movies'

    return (
        <>
            <h3 className='list-filter m-4'>{listTitle}</h3>
            <section className='list-section m-0 ms-md-2 me-md-2 p-0 pb-3 text-white'>
                
                {(loading && !data) ? <div className='list-loading'>
                    <i className="fa-solid fa-spinner fa-spin d-block loading-spinner"></i>
                    <p className='text-center mt-3'>Loading...</p>
                </div> :
                (data ? 
                    (data.results.map(movie => (
                        <div
                            key={movie.id}
                            className='list-movieDiv'
                            onClick={() => navigate(`/movieDetail/${movie.id}`)}>
                                
                            <article className='list-moviePosterArticle'>
                                <img className='list-moviePoster' src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : noImage} alt={`${movie.original_title} movie poster`} />
                            </article>

                            <h5 className='list-movieTitle text-center mt-1 mb-3'>{movie.title}</h5>
                        </div> 
                    ))) :
                    (<p className='list-unableToLoadtext-center'>Unable to load movies. Please try again.</p>)
                )}
                
                <div ref={lastElementRef}></div>
            </section>
        </>
    );
};

export default List;
