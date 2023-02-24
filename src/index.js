import React  from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "@asgardeo/auth-react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const config = {
    signInRedirectURL: "http://localhost:3000",
    signOutRedirectURL: "http://localhost:3000",
    clientID: "5WQ40pdA8WxnlYV6pjc8uYcgwW0a",
    baseUrl: "https://api.asgardeo.io/t/godwinshrimal",
    scope: [ "openid","profile","groups" ]
};

const client = new ApolloClient({
    uri: 'https://c4940d00-9dbf-45e0-b5da-00f6cd610979-dev.e1-us-east-azure.choreoapis.dev/gkym/catgraphqlapi/1.0.0/catalogs',
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  });


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <React.StrictMode>
    <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossOrigin="true"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js" crossOrigin="true"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js" crossOrigin="true"></script>
    
    <AuthProvider config={ config }>`
        <App />
    </AuthProvider>
    </React.StrictMode>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
