import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import React, { useContext, useState } from "react"
import { UserContext } from './context/UserContext'

const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validated, setValidated] = useState(false)
    const [error, setError] = useState("")
    const [userContext, setUserContext] = useContext(UserContext)

    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return
        }
        setIsSubmitting(true)
        setError("")

        const genericErrorMessage = "Something went wrong! Please try again later."

        fetch(process.env.REACT_APP_API_ENDPOINT + "users/signup", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password}),
        }).then(async res => {
            setIsSubmitting(false)
            if (res.status === 200) {
                const data = await res.json()
                setUserContext(oldValues => {
                    return {...oldValues, token: data.token}
                })
            } else {
                const data = await res.json()
                if (data.message) setError(data.message || genericErrorMessage)
                setUsername("")
                setPassword("")
            }
        })
        .catch(error => {
            setIsSubmitting(false)
            setError(genericErrorMessage)
        })
    }

    return (
        <>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form className='register-form' noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="registerUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} value={username} />
                    <Form.Control.Feedback type="invalid">
                        Please enter a username.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
                    <Form.Control.Feedback type="invalid">
                        Please enter a password.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {`${isSubmitting ? "Registering" : "Register"}`}
                </Button>
            </Form>
        </>
    )
}

export default Register