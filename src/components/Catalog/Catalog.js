import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as regThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "@asgardeo/auth-react";
import axios from 'axios';


// import PetStoreNav from '../../App.js';


  export default function Catalog() {
    const [token, settoken] = useState([]);

    useEffect(() => {
        document.title = 'PetStore Catalog';
      }, []);    
      
      const { getAccessToken } = useAuthContext();
      const [catalogs, setCatalogs] = useState([]);      
      
      useEffect(() => {
          getAccessToken().then((accessToken) => {
              console.log("token " + accessToken);    
              settoken(accessToken);
              const url = 'https://c4940d00-9dbf-45e0-b5da-00f6cd610979-dev.e1-us-east-azure.choreoapis.dev/gkym/catgraphqlapi/1.0.0/catalogs';
              const headers = {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
              };
  
              const query = `
              {
                  all {
                  description
                  color
                  includes
                  intended
                  item_id
                  title
                  material
                  unit_price
                  }
              }
              `;
              
              const fetchCatalogs = async () => {
                  const result = await axios.post(url, { query }, { headers });
                  return result.data.data.all;
                };
  
                
                  const fetchData = async () => {
                    const catData = await fetchCatalogs();
                    setCatalogs(catData);
                    console.log("catData: " + catData);
                  };
                
                  fetchData();                  
  
          }).catch((error) => {
              //console.log(error);
          });
                  
      }, []);
      useEffect(() => {
          document.title = "Admin | PetStore"
      }, []); 


      const handleAdd = (item_id,unit_price) => {
        console.log("######## handleAdd " + item_id);
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
          };                 
    
        console.log("Submit for delete ");    
    
        //invoke http rest api
        axios.post('https://c4940d00-9dbf-45e0-b5da-00f6cd610979-dev.e1-us-east-azure.choreoapis.dev/gkym/cartapi/1.0.0/cartitem',
        {
          "cart_id": 0,
          "item_id": item_id,
          "quantity": 1,
          "total": 0,
          "unit_price": unit_price,
          "user_name": "godwin"
        },        
        config)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        }); 
      };
  

    return (
      <>
      <Container>
        <Row>
          {catalogs.map(cat => (

                <Col>
                  
                    <img src={require('./item-1.png')} width="300" alt="dog"/><br />
                    <h4>{cat.title}</h4>
                    <p>{cat.description}</p>

                    <p>
                     <b>Includes: </b> {cat.intended}<br />
                     <b>Intended For:</b> {cat.intended}<br />
                     <b>Color:</b> {cat.color}<br />
                     <b>Material: </b> {cat.material}<br />
                    </p>

                    {/* <span style={itemPrice}>{cat.unit_price}</span> <Button variant="danger">Add to cart</Button> */}
                    <span>{cat.unit_price}</span> <Button variant="danger" onClick={() => handleAdd(cat.item_id,cat.unit_price)} >Add to cart</Button>
                    <br /><br />
                    Follow updates &nbsp;&nbsp;<FontAwesomeIcon icon={regThumbsUp} /> 
                  
                  </Col>
              ))}  
                        
         </Row>
       
      </Container>
    </>
    );
}