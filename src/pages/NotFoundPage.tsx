import { Link } from 'react-router-dom'


const NotFoundPage = () => {
  return (
   
      <div className="flex flex-col items-center justify-center space-y-6 min-h-[50vh] text-center">
        <h1 className="text-4xl font-bold text-gray-900">404 - Página Não Encontrada</h1>
        <p className="text-xl text-gray-600">A página que você está procurando não existe.</p>
        <Link to="/">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Voltar para a Página Inicial
          </button>
        </Link>
      </div>
 
  )
}

export default NotFoundPage