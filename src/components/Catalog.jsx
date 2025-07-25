import List from './List';
import { useState, useEffect } from 'react';
import axios from 'axios'
import './css/catalog.css'

const Catalog = () => {
    // Para ver lista de películas por género
    const [genresList, setGenresList] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedGenreName, setSelectedGenreName] = useState('');
    const [loadingGenres, setLoadingGenres] = useState(false);

    useEffect(() => {
        getGenres();
    }, []);

    const getGenres = async () => {
        setLoadingGenres(true);
        try {
            const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}` }
            });
            if (res.status !== 200) return alert(`Error getting genres list: ${res.statusText}`);
            return setGenresList(res.data.genres);
        
        } catch (err) {
            alert(`Error getting genres list: ${err.message}`);
            return setGenresList([]);
        } finally {
            setLoadingGenres(false);
        };
    };

    const genreFilter = selectedGenre ? `/discover/movie?with_genres=${selectedGenre}&` : '';

    // Para buscar películas por título
    const [title, setTitle] = useState('');
    const [searchTitle, setSearchTitle] = useState(false);
    const [submittedTitle, setSubmittedTitle] = useState('');

    const titleFilter = submittedTitle ? `/search/movie?query=${encodeURIComponent(submittedTitle)}&` : null;

    // Si vuelvo a buscar por género, se inhabilita la búsqueda por título
    useEffect(() => {
        setSearchTitle(false);
        setSubmittedTitle('');
        setTitle('');
    }, [selectedGenre]);

    return (
        <>
            <div className='catalog-background'>
                <header className='d-block d-md-flex align-items-md-center'>
                    <h1 className="text-white catalog-headerTitle mt-2 mb-2 m-md-0 ms-md-4 d-flex justify-content-center justify-content-md-start"><span className='catalog-headerTitle-hal'>HAL</span><span className='catalog-headerTitle-movies'>Movies</span></h1>
                    <div className='d-flex ms-0 ms-md-auto mt-2 mt-md-0 me-md-4 justify-content-md-end justify-content-center gap-2' >
                        <div className='catalog-selectDiv'>
                            <select
                                className='catalog-selectGenre'
                                name="genres"
                                id="genres"
                                value={selectedGenre}
                                onChange={
                                    (e) => {
                                        const selectedId = e.target.value;
                                        setSelectedGenre(selectedId);

                                        const selected = genresList.find(g => g.id.toString() === selectedId);
                                        setSelectedGenreName(selected ? selected.name : '');
                                    }}
                                required>
                                <option value="" disabled hidden>{loadingGenres ? 'Loading...' : 'Search genre'}</option>
                                {!loadingGenres && genresList && genresList.map(genre => (
                                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                                ))}
                            </select>
                            <p className='catalog-selectChevron'><i className="fa-solid fa-chevron-down"></i></p>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setSearchTitle(true);
                            setSubmittedTitle(title);
                        }}>
                            <div className='catalog-searchDiv ms-2 ms-md-4'>
                                <input
                                    className='catalog-searchTitle'
                                    type="search"
                                    placeholder='Search title'
                                    maxLength={40}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <button className='catalog-searchTitleButton' type='submit'>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </header>
                <main>
                    <List
                        filter={!searchTitle ? (selectedGenre ? genreFilter : null) : titleFilter}
                        filterName={!searchTitle ? (selectedGenreName ? `Genre: ${selectedGenreName}` : null) : (submittedTitle ? `Results for: ${submittedTitle}` : null)}
                        setSelectedGenre={setSelectedGenre}
                        setSelectedGenreName={setSelectedGenreName} />
                </main>
            </div>
        </>
    );
};

export default Catalog;