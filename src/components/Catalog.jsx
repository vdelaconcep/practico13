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

    const titleFilter = title ? `/search/movie?query=${encodeURIComponent(title)}&` : null;

    // Si vuelvo a buscar por género, se inhabilita la búsqueda por título
    useEffect(() => {
        setSearchTitle(false);
    }, [selectedGenre, setSelectedGenre]);

    return (
        <>
            <div className='catalog-background'>
                <header className='hstack'>
                    <h1 className="text-white hal ms-4 mb-0">HAL</h1>
                    <div className='d-flex ms-auto me-3 me-sm-4 flex-column flex-sm-row align-items-end align-items-sm-center' >
                        <select
                            className='catalog-selectGenre mb-2 mb-sm-0 mt-2 mt-sm-0'
                            name="genres"
                            id="genres"
                            value={selectedGenre}
                            onChange={
                                (e) => {
                                    const selectedId = e.target.value;
                                    setSelectedGenre(selectedId);

                                    const selected = genresList.find(g => g.id.toString() === selectedId);
                                    setSelectedGenreName(selected ? selected.name : '');
                                }}>
                            <option value="" disabled>{loadingGenres ? 'Loading...' : 'Search by genre'}</option>
                            {!loadingGenres && genresList && genresList.map(genre => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setSearchTitle(true);
                        }}>
                            <div className='ms-sm-4'>
                                <input
                                    className='catalog-searchTitle'
                                    type="search"
                                    placeholder='Search title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <button className='catalog-searchTitleButton' type='submit'>
                                    <i className="fa-solid fa-magnifying-glass catalog-searchIcon"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </header>
                <main>
                    <List
                        filter={!searchTitle ? (selectedGenre ? genreFilter : null) : titleFilter}
                        filterName={!searchTitle ? (selectedGenreName ? `Genre: ${selectedGenreName}` : null) : (title ? `Results for: ${title}` : null)} />
                </main>
            </div>
        </>
    );
};

export default Catalog;