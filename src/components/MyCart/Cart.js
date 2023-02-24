import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Form, FormLabel, Button } from 'react-bootstrap';
import '../../App.js';
import '../../index.css';
import {InputNumber, InputGroup} from 'rsuite';
import './inputnumber.less'
import axios from 'axios';
import { useAuthContext } from "@asgardeo/auth-react";

export default function MyCart() {
    const [token, settoken] = useState([]);
    const { getAccessToken } = useAuthContext();
    const [cart, setcart] = useState([]);  

    const [cardnumber, setcardnumber] = useState([]);
    const [cvv, setcvv] = useState([]);
    const [expiration, setexpiration] = useState([]);
    const [name, setname] = useState([]);

  useEffect(() => {
    document.title = 'My Cart';
  }, []);

  // State to keep track of the number of items in the cart
  const [value, setValue] = React.useState(0);
  const handleMinus = () => {
    setValue(parseInt(value, 10) - 1);
  };
  const handlePlus = () => {
    setValue(parseInt(value, 10) + 1);
  };


  useEffect(() => {
    getAccessToken().then((accessToken) => {
        console.log("token " + accessToken);    
        settoken(accessToken);

        const url = 'https://c4940d00-9dbf-45e0-b5da-00f6cd610979-prod.e1-us-east-azure.choreoapis.dev/gkym/cartapi/1.0.0/cartitem';

        const headers = {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          };
        
        const fetchCart = async () => {
            const result = await axios.get(url, { headers });
            return result.data;
          };
       
        const fetchData = async () => {
            const cartData = await fetchCart();
            setcart(cartData);
            console.log("cartData: " + cartData);
        };        
        fetchData();

    }).catch((error) => {
        //console.log(error);
    });
            
}, []);


const handleCheckout = (cart_id) => {
    console.log("######## handleCheckout cart_id " + cart_id);
    const config = {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        }
      };                 
    //invoke http rest api
    axios.post('https://c4940d00-9dbf-45e0-b5da-00f6cd610979-prod.e1-us-east-azure.choreoapis.dev/gkym/cartapi/1.0.0/checkout',
    {
        "card_number": cardnumber,
        "cart_id": cart_id,
        "cvv": cvv,
        "expiration": expiration,
        "name": name
    },        
    config)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    }); 
  };



  // Number of items in the cart
  let numItems = 0;
  let subtotal = 0;
  let cart_id = 0;
  
  return (
    
    <>
    <Container className="mt-5">
        <Row>
            <Col>
                <p>Checking out items - You have {numItems} items in your cart</p>
                <table className='table align-middle'> 
                   <thead>
                    <tr className="text-center">
                        <th scope="col"></th>
                        <th scope="col">QTY</th>
                        <th scope="col" >Unit</th>
                        <th scope="col">Total</th>
                    </tr>
                   </thead>           
                   <tbody>

                   {cart.map(cat => (
                    cart_id = cat.cart_id,
                    numItems = numItems + cat.quantity,
                    <tr>
                    <td>{cat.title}</td>
                    <td>{cat.quantity}</td>
                    {/* <td width="120px"><InputGroup>
                    <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
                    <InputNumber className="custom-input-number" value={3} onChange={setValue} />
                    <InputGroup.Button onClick={handlePlus}>+</InputGroup.Button>
                    </InputGroup></td> */}

                    <td width="120px" className="text-center">$ {cat.unit_price}</td>
                    <td width="120px" className="text-center">$ {cat.unit_price * cat.quantity}</td>
                    </tr>    

                    //subtotal = subtotal + (cat.unit_price * cat.quantity);

                    ))}  

                   </tbody>          
                </table>
            </Col>
            <Col className="col-4 bg-primary p-4 text-white rounded-3"><h2>Card Details</h2>
                <Form>
                    <Row>
                    <Form.Group className="mb-3" controlId="formNameOnCard">
                        <FormLabel>Name on Card</FormLabel>
                        <Form.Control type="text" placeholder="Enter full name" onChange={(e) => setname(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCardNumber">
                        <FormLabel>Card Number</FormLabel>
                        <Form.Control type="text" placeholder="Enter card number" onChange={(e) => setcardnumber(e.target.value)}/>
                    </Form.Group>
                    </Row>
                    <Row><Col>
                    <Form.Group className="mb-3" controlId="formExpirationDate">
                        <FormLabel>Expiration Date</FormLabel>
                        <Form.Control type="text" placeholder="Expiration Date" onChange={(e) => setexpiration(e.target.value)}/>
                    </Form.Group></Col>
                    <Col>
                    <Form.Group className="mb-3" controlId="formCVV">
                        <FormLabel>CVV</FormLabel>
                        <Form.Control type="text" placeholder="CVV" onChange={(e) => setcvv(e.target.value)}/>
                    </Form.Group></Col>
                    </Row>
                    {/* <Row className="p-2">
                        <Col>Subtotal</Col>
                        <Col className="col-2 d-flex justify-content-right">$134.97</Col>
                    </Row>
                    <Row className="p-2">
                        <Col>Shipping</Col>
                        <Col className="col-2 d-flex justify-content-right">$20</Col>
                    </Row>
                    <Row className="p-2">
                        <Col c>Tax</Col>
                        <Col className="col-2 d-flex justify-content-right">$10.34</Col>
                    </Row>

                    <Row className="p-2">
                        <Col>Total (inc. tax)</Col>
                        <Col className="col-2 d-flex justify-content-right">$165.31</Col>
                    </Row> */}
                    <Row className="d-flex justify-content-center p-3">
                        <Button variant="warning" size="lg" onClick={() => handleCheckout(cart_id)}>
                            Place Order
                        </Button>
                        </Row>
                </Form>
            </Col>
        </Row>
        
    </Container>
    </>
  );
}