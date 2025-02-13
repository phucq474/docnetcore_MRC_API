import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
//LG
//import 'primereact/resources/themes/luna-pink/theme.css';
//ESPSON
// import 'primereact/resources/themes/nova-accent/theme.css';
//Aqua -pana
//import 'primereact/resources/themes/luna-blue/theme.css';
//Daikin
// import 'primereact/resources/themes/luna-green/theme.css';
//hafele
// import 'primereact/resources/themes/luna-pink/theme.css';
const store = configureStore();
const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement);
registerServiceWorker();