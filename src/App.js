// import logo from './logo.svg';
import React, { useEffect } from 'react';
import './App.css';
import './App.scss';
import { Nav, Navbar, Container }  from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';

import Catalog from './components/Catalog/Catalog.js';
import MyCart from './components/MyCart/Cart.js';
import Admin from './components/Admin/Admin.js';
import { useAuthContext } from "@asgardeo/auth-react";
import AddItems from './components/Admin/AddItems';
import { useHistory } from 'react-router-dom';

// Component to render the login/signup/logout menu
const RightLoginSignupMenu = () => {
  // Based on Asgardeo SDK, set a variable like below to check and conditionally render the menu
  //let isLoggedIn = false;

  // Host the menu content and return it at the end of the function
  let menu;
  const { state, signIn, signOut } = useAuthContext();
  const { getBasicUserInfo } = useAuthContext();
  

  
  // Conditionally render the following two links based on whether the user is logged in or not
  // print object as a string

   console.log("Logged in 2: " +  signIn.toString());
    console.log("State: " +  state.isAuthenticated);
    getBasicUserInfo().then((basicUserDetails) => {
    console.log("Userinfo : " + JSON.stringify(basicUserDetails));
    console.log("Userinfo groups: " + basicUserDetails.groups);
    var isadmin = basicUserDetails.groups.includes("ecom_admin");
}).catch((error) => {
    // Handle the error
})
  if (state.isAuthenticated) {
    menu =  <>
      <Nav>
      <Nav.Link href="#deets" onClick={() => signOut()}>Logout</Nav.Link>
      <Nav.Link href="#deets"><FontAwesomeIcon icon={faUser} /></Nav.Link></Nav>
    </>

    
  } else {

    menu = <>
      <Nav>
      
      <Nav.Link href="#deets" onClick={() => signIn()}>Login</Nav.Link>
      <Nav.Link href="#deets">Sign Up</Nav.Link></Nav>
    </>
  }
  return menu;
}

// Component to render the navigation bar
const PetStoreNav = () => {
  return (
    <>
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">PetStore</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Catalog</Link>
            <Link to="/mycart" className="nav-link">My Cart</Link>
            <Link exact to="/admin" className="nav-link">Admin</Link>      

          </Nav>
        </Navbar.Collapse>
        <RightLoginSignupMenu />
      </Container>
    </Navbar>
    </>
  );
};

// Main app component
const App = () => {
  
  useEffect(() => {
    document.title = 'PetStore';
  }, []);
  return (
    <>
      <BrowserRouter>
      <PetStoreNav />
      <Switch>
        <Route exact path="/">
          <Catalog />
        </Route>
        <Route path="/mycart">
          <MyCart />
        </Route>
        <Route exact path="/admin">
              <Admin />
          </Route>
        
        <Route path="/additems">
          <AddItems />
        </Route>
        if(isadmin){          
          <Redirect exact from="/" to="/admin" />
        }
      </Switch>

      

    </BrowserRouter>
    </>
  );
}

export default App;
