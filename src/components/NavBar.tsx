import { Link, useNavigate } from 'react-router-dom'
import { BiSearchAlt2 } from 'react-icons/bi'
import { Film,Menu, ChevronLeft} from 'lucide-react'
import { useState } from 'react'

const NavBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para fechar o menu ao clicar em um link
  const closeMenu = () => setIsMenuOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${search}`);
    setSearch("");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#1a2332] border-b border-[#2a3442] px-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex h-14 items-center justify-between margin-nav">

        {/* 3. BOTÃO DE MENU (MOBILE)
            'flex' = visível no mobile
            'sm:hidden' = escondido a partir de 640px
        */}
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna o estado do menu
            className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none bg-transparent"
          >
            {/* Muda o ícone dependendo se o menu está aberto ou fechado */}
            {isMenuOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </div>
        
        <div className='ml-4 sm:ml-10'>
        {/* Logo (Ajustei para sm:) */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-2">
          <Film className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
          <span className="text-lg sm:text-xl font-semibold text-orange-500">MovieDB</span>
        </Link>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center justify-center px-4">
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Buscar filmes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // Removi 'w-20' para 'w-full' funcionar corretamente no mobile
                className="w-full h-10 rounded-full bg-[#2b2b2b] text-gray-400 placeholder-gray-400 pl-6 pr-10 border border-transparent 
                focus:outline-none focus:ring-2 focus:ring-orange-500 input-com-padding-esquerdo"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full flex items-center justify-center"
              >
                <BiSearchAlt2 size={18} />
              </button>
            </div>
          </div>
        </form>

        {/* 2. LINKS DO DESKTOP 
            'hidden' = escondido no mobile
            'sm:flex' = vira flex (visível) a partir de 640px
        */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/" className="text-lg font-large text-gray-300 transition-colors hover:text-white">
            Home
          </Link>
          <Link to="/favorites" className=" text-lg text-gray-300 transition-colors hover:text-white">
            Favoritos
          </Link>
        </div>

        
      </div>

      {/* 4. O MENU LATERAL (SIDEBAR) */}
      <div
        className={`fixed top-14 left-0 h-screen w-64 bg-[#121822] z-40 transform transition-transform duration-300 ease-in-out
                   ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                   sm:hidden`} // O menu lateral também some no desktop
      >
        <nav className="flex flex-col p-4 gap-4">
          <Link to="/" onClick={closeMenu} className="text-lg text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/favorites" onClick={closeMenu} className="text-lg text-gray-300 hover:text-white">
            Favoritos
          </Link>
        </nav>
      </div>
    </nav>
  )
}

export default NavBar
