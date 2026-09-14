interface Props {
  message?: string
  error?: boolean
}

/** Pantalla de carga o de error, con el casco como indicador. */
export function Status({ message = 'Un momento…', error = false }: Props) {
  return (
    <main className="status">
      {!error && <img src="/helmet.png" alt="" width="55" height="89" className="status__helmet" />}
      <p>{error ? 'Algo salió mal.' : message}</p>
      {error && (
        <>
          <p className="status__detail">{message}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </>
      )}
    </main>
  )
}
