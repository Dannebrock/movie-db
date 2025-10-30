import { useState } from 'react'

function Home() {
  const [count, setCount] = useState(0)

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900">Movie DB</h1>
      <p className="text-xl text-gray-600">Bem-vindo ao nosso catálogo de filmes</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <p>Conteúdo do filme virá aqui</p>
        </div>
      </div>
    </div>
  )
}

export default Home
