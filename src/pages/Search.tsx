import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSearch } from '../contexts/SearchContext'

function useQuery() {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

const Search = () => {
  const { setQuery, query } = useSearch()
  const params = useQuery()
  const q = params.get('q') || ''

  useEffect(() => {
    if (q && q !== query) setQuery(q)
  }, [q])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-4">Resultados para: "{q}"</h2>
      <p className="text-gray-600">Aqui você verá a lista de filmes que combinam com a busca.</p>
    </div>
  )
}

export default Search