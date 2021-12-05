import React, { Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import { QueryClient, QueryCache, QueryClientProvider } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import PropTypes from 'prop-types'
import HomePage from './pages/HomePage'
import CreateExercise from './pages/CreateExercise'
import NavBar from './components/layout/NavBar'
import EditExercise from './pages/EditExercise'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // eslint-disable-next-line no-alert
    onError: (error, query) => {
      // 🎉 only show error if we already have data in the cache
      // which indicates a failed background update
      if (query.state.data !== undefined) {
        alert(`Something went wrong: ${error.message}`)
      }
    },
  }),
  defaultOptions: {
    queries: {
      suspense: true,
      retry: 0,
    },
  },
})

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>There was an error:</p>
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}

ErrorFallback.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
}

const handleReset = () => {
  console.log('RESET ERROR')
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="App">
      <NavBar />
      <Switch>
        <Route path="/home" exact>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={handleReset}
          >
            <Suspense fallback={<div>loading...</div>}>
              <HomePage />
            </Suspense>
          </ErrorBoundary>
        </Route>
        <Route path="/create-exercise" exact>
          <CreateExercise />
        </Route>
        <Route path="/exercises/:id/edit" exact>
          <EditExercise />
        </Route>
      </Switch>
    </div>
  </QueryClientProvider>
)

export default App
