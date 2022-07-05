import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import React, { useContext, useState } from "react"

import { UserContext } from './context/UserContext'

function NewRefill(props) {
    const [price, setPrice] = useState("")
    const [gallons, setGallons] = useState("")
    const [miles, setMiles] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validated, setValidated] = useState(false)
    const [error, setError] = useState("")
    const [userContext, ] = useContext(UserContext)

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

        fetch(process.env.REACT_APP_API_ENDPOINT + "data/newRefill", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({total_price: price, gallons: gallons, miles: miles}),
        }).then(async res => {
            setIsSubmitting(false)
            switch (res.status) {
                case 400:
                    setError("Ensure all fields are filled in")
                    break;
                case 200:
                    props.refreshHandler()
                    props.setKey("dataTable")
                    break;
                default:
                    setError(genericErrorMessage)
                    break;
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
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="newRefillPrice">
                    <Form.Label>Total Price</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control required type="number" step="0.01" placeholder="Price" onChange={e => setPrice(e.target.value)} value={price} />
                        <Form.Control.Feedback type="invalid">
                            Please enter the total price of the fillup.
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="newRefillGallons">
                    <Form.Label>Gallons</Form.Label>
                    <Form.Control required type="number" step="0.001" placeholder="Gallons" onChange={e => setGallons(e.target.value)} value={gallons} />
                    <Form.Control.Feedback type="invalid">
                        Please enter the total gallons purchased.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="newRefillMiles">
                    <Form.Label>Miles</Form.Label>
                    <Form.Control required type="number" step="0.1" placeholder="Miles" onChange={e => setMiles(e.target.value)} value={miles} />
                    <Form.Control.Feedback type="invalid">
                        Please enter the number of miles driven.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {`${isSubmitting ? "Submitting" : "Submit"}`}
                </Button>
            </Form>
        </>
    )
}

export default NewRefill