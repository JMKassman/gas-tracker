import React, { useCallback, useContext, useEffect, useState } from "react"
import Alert from 'react-bootstrap/Alert'
import Button from "react-bootstrap/Button"
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { UserContext } from "./context/UserContext"

import Loader from "./loader"
import NewRefill from "./NewRefill"
import DataTable from "./DataTable"

function PostAuth() {
    const [userContext, setUserContext] = useContext(UserContext)
    const [key, setKey] = useState("newRefill")

    const fetchUserDetails = useCallback(() => {
        fetch(process.env.REACT_APP_API_ENDPOINT + "users/me", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userContext.token}`,
            },
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setUserContext(oldValues => {
                    return {...oldValues, userDetails: data}
                })
            } else if (res.status === 401) {
                window.location.reload()
            } else {
                setUserContext(oldValues => {
                    return {...oldValues, userDetails: null}
                })
            }
        })
    }, [setUserContext, userContext.token])

    useEffect(() => {
        if (!userContext.userDetails) fetchUserDetails()
    }, [userContext.userDetails, fetchUserDetails])

    const refreshHandler = () => {
        setUserContext(oldValues => {
            return {...oldValues, userDetails: undefined}
        })
    }

    const logoutHandler = () => {
        fetch(process.env.REACT_APP_API_ENDPOINT + "users/logout", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userContext.token}`,
            },
        }).then(async res => {
            setUserContext(oldValues => {
                return {...oldValues, userDetails: undefined, token: null}
            })
            window.localStorage.setItem("logout", Date.now())
        })
    }

    if (userContext.userDetails === null) {
        return <Alert variant="danger">Failed to load. Try again later</Alert>
    } else if (!userContext.userDetails) {
        return <Loader />
    } else {
        return (
            <div>
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0 me-2">Welcome {userContext.userDetails.username}</h3>
                    <Button variant="primary" onClick={logoutHandler}>Logout</Button>
                </div>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="post-auth-tabs" className="my-3">
                    <Tab eventKey="newRefill" title="New Refill">
                        <NewRefill refreshHandler={refreshHandler} setKey={setKey} />
                    </Tab>
                    <Tab eventKey="dataTable" title="View Data">
                        <DataTable data={userContext.userDetails.refills} refreshHandler={refreshHandler}/>
                    </Tab>
                </Tabs>
            </div>
        )
    }
}

export default PostAuth