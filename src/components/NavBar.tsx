import { Link } from 'react-router-dom'
import { BiCameraMovie, BiSearchAlt2 } from 'react-icons/bi'

const NavBar = () => {
  return (
    <nav id='navbar'>
      <h2>
        <Link to='/'><BiCameraMovie/> MovieDB</Link>        
      </h2>
      <form >
        <input type='text' placeholder='Buscar filmes...' />
        <button type='submit'><BiSearchAlt2/></button>
      </form>
      <Link  to='/' >Home</Link>
      <Link to='/favorites' >Favoritos</Link>     

    </nav>
  )
}

export default NavBar