import { useEffect, useState } from 'react'

// `loader` tiene que ser una funcion estable (importada de services), si no se vuelve a pedir en cada render.
export const useApiList = (loader) => {
  const [state, setState] = useState({ data: [], loading: true, error: null })

  useEffect(() => {
    let alive = true
    loader()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: [], loading: false, error }))
    return () => {
      alive = false
    }
  }, [loader])

  return state
}
