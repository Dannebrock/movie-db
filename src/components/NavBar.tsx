import { Link, useNavigate, NavLink } from 'react-router-dom'
import { BiSearchAlt2 } from 'react-icons/bi'
import { Film,Menu, ChevronLeft, House,Heart} from 'lucide-react'
import { useState } from 'react'

const NavBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
  const closeMenu = () => setIsMenuOpen(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${search}`);
    setSearch("");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#1a2332] border-b border-[#2a3442] px-2 sm:px-6 lg:px-10">
      <div className="mx-auto flex h-20 items-center justify-between margin-nav">
                
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none bg-transparent"
          >            
            {isMenuOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </div>        
        <div className='ml-4 sm:ml-10'>       
        <Link to="/" className="flex flex-shrink-0 items-center gap-2">
          <Film className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
          <span className="text-lg sm:text-xl font-semibold text-orange-500">MovieDB</span>
        </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex items-center justify-center px-4">
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Buscar filmes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}                
                className="w-full h-10 rounded-full bg-[#2b2b2b] text-gray-400 placeholder-gray-400 pl-6 pr-10 border border-transparent 
                focus:outline-none focus:ring-2 focus:ring-orange-500 input-com-padding-esquerdo"
              />
              <button
                type="submit"
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full flex items-center justify-center "
              >
                <BiSearchAlt2 size={18} />
              </button>
            </div>
          </div>
        </form>        
        <div className="hidden sm:flex items-center gap-6">
         <NavLink 
            to="/"
            end         
            className={({ isActive }) =>
              `gap-2 text-lg font-large text-white transition-colors hover:text-white rounded-lg w-24 h-10 flex items-center justify-center 
              ${isActive ? 'bg-indigo-600' : ''}` 
            }
            >
            <House size={18}/> Home
          </NavLink>      
          <NavLink 
            to="/favorites"         
            className={({ isActive }) =>
              `gap-2 text-lg transition-colors hover:text-white rounded-lg w-28 h-10 flex items-center justify-center 
              ${isActive ? 'bg-indigo-600' : ''}` 
            }
            >
            <Heart size={18} /> Favoritos
          </NavLink>
        </div>        
      </div>
      
      <div
        className={`fixed top-14 left-0 h-screen w-64 bg-[#121822] z-40 transform transition-transform duration-300 ease-in-out
                   ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                   sm:hidden`} >
        <div className="flex flex-col p-4 gap-4">
          <NavLink 
            to="/"
            end         
            onClick={closeMenu}
            className={({ isActive }) =>
              `gap-2 text-lg font-large text-white transition-colors hover:text-white rounded-lg w-24 h-10 flex items-center justify-center 
              ${isActive ? 'bg-indigo-600' : ''}` 
            }
          >
            <House size={18}/> Home
          </NavLink>
      
          <NavLink 
            to="/favorites"         
            onClick={closeMenu}
            className={({ isActive }) =>
              `gap-2 text-lg transition-colors hover:text-white rounded-lg w-28 h-10 flex items-center justify-center 
              ${isActive ? 'bg-indigo-600' : ''}` 
            }
              >
            <Heart size={18} /> Favoritos
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
export default NavBar
