import { useNavigate } from 'react-router-dom';
import './css/home.css';

const Home = () => {
    const navigate = useNavigate()
    return (
        <section className="home-section">
            <div className='d-flex flex-column'>
                <h1 className='home-title'><span className='home-title-hal'>HAL</span><span className='home-title-movies'>Movies</span></h1>
                <h4 className='home-subtitle'>Your movie database</h4>
                <button
                    className='home-button btn mt-5'
                    onClick={() => navigate('/catalog')}>
                    Start
                </button>
            </div>
        </section>
    )
};

export default Home;