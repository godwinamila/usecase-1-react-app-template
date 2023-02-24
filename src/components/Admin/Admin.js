import React, {useEffect, useState} from 'react';
import { Container, Button, Table }  from 'react-bootstrap';
import { useAuthContext } from "@asgardeo/auth-react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';




function useNavigation() {
    const history = useHistory();
  
    function navigateToNextPage() {
      history.push('/admin');
    }
  
    return { navigateToNextPage };
  }

export default function Admin() {
    const [catalogs, setCatalogs] = useState([]);
    const [token, settoken] = useState([]);
    const { getAccessToken } = useAuthContext();
    const { navigateToNextPage } = useNavigation();
    const [showMessage, setShowMessage] = useState(false);

    
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

    const history = useHistory();
    const handleClick = () => {
        history.push('/AddItems');
    };

    const handleDelete = (id) => {
        console.log("######## handleDelete " + id);
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
          };

                 
    
        console.log("Submit for delete ");    
    
        //invoke http rest api
        axios.delete('https://c4940d00-9dbf-45e0-b5da-00f6cd610979-prod.e1-us-east-azure.choreoapis.dev/gkym/catalogapi/1.0.0/catalogs?catalogid='+id,config)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        }); 

        navigateToNextPage();
        setShowMessage(true);    
        // const history = useHistory();  
        // history.push('/admin');

      };



    return (
        <>
        <Container className="mt-5">
            {showMessage && <p color='green'>Item deleted successfully!</p>}
            <Table bordered hover>
                <thead>
                    <tr>
                        <th scope="col" width="150px">Title</th>
                        <th scope="col" width="400px">Description</th>
                        <th scope="col">Includes</th>
                        <th scope="col">Intended For</th>
                        <th scope="col" width="50px">Color</th>
                        <th scope="col">Material</th>
                        <th scope="col">Price</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                    {catalogs.map(cat => (
                    <tr className="align-middle">
                        <td>{cat.title}</td>
                        <td>{cat.description}</td>
                        <td>{cat.includes}</td>
                        <td>{cat.intended}</td>
                        <td>{cat.color}</td>
                        <td>{cat.material}</td>
                        <td>{cat.unit_price}</td>
                        
                        <td><Button variant="primary" size="sm">Edit
                        </Button>&nbsp;<Button variant="danger" size="sm" onClick={() => handleDelete(cat.item_id)}>Delete</Button>
                        </td>
                    </tr>
                    ))}
                    <tr className="text-end">
                        <td colSpan="8"><Button variant="primary" className="float-right" onClick={handleClick}>Add New Product</Button></td>
                    </tr>
                </thead>
            </Table>
        </Container>
        </>
    );    

   
          
          
          

    
}