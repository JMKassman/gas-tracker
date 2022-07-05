import { useCallback, useContext, useEffect } from 'react';

import './App.css';

import PreAuth from './pre-auth';
import PostAuth from './post-auth';
import Loader from './loader';
import { UserContext } from './context/UserContext';

function App() {
  const [userContext, setUserContext] = useContext(UserContext)

  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
    }).then(async res => {
      if (res.ok) {
        const data = await res.json()
        setUserContext(oldValues => {
          return {...oldValues, token: data.token}
        })
      } else {
        setUserContext(oldValues => {
          return {...oldValues, token: null}
        })
      }

      // refresh every 5 minutes
      setTimeout(verifyUser, 5 * 60 * 1000)
    })
  }, [setUserContext])

  useEffect(() => {verifyUser()}, [verifyUser])

  const syncLogout = useCallback(event => {
    if (event.key === "logout") {
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    window.addEventListener("storage", syncLogout)
    return () => window.removeEventListener("storage", syncLogout)
  }, [syncLogout])

  return (
    <div className="mx-3 mt-3">
      {userContext.token === null ? <PreAuth /> : userContext.token ? <PostAuth /> : <Loader />}
    </div>
  )
}

export default App;
