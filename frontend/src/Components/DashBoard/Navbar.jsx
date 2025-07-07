import { useNavigate } from 'react-router-dom';

function Navbar(){
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    return(
        <nav>
          <i className='bx bx-menu' ></i>
          <h4>Menu</h4>
          <form action="#">
            <div className="form-input">
            </div>
          </form>
          <button onClick={handleLogout} style={{marginLeft: 'auto', padding: '8px 16px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Logout</button>
        </nav>
    );
}

export default Navbar;