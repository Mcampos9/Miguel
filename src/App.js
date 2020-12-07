import React, { Component } from "react";
import firebase from "firebase";
import LOGO from "./logo-universidad-del-cauca.png";
import SLIDER from "./slider.jpg";
import "./App.css";

// import image from '../images/haderpartida.jpg'

const firebaseConfig = {
  apiKey: "AIzaSyDRxPEdlUpboeMdtwjzMtriJg6QxZJcDJ0",
  authDomain: "proyectohumedad-a68df.firebaseapp.com",
  databaseURL: "https://proyectohumedad-a68df-default-rtdb.firebaseio.com",
  projectId: "proyectohumedad-a68df",
  storageBucket: "proyectohumedad-a68df.appspot.com",
  messagingSenderId: "217970932633",
  appId: "1:217970932633:web:fba24cb6ebcc52ac693108",
  measurementId: "G-NLJKEPRX40",
};

firebase.initializeApp(firebaseConfig);

var color = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      formulario: {
        nombre: "",
        apellido: "",
        informacion: "",
        celular: "",
        correo: "",
      },
      humidity: 0,
      led: null,
      text: null,
    };
  }

  componentWillMount() {
    const humedad = firebase.database().ref().child("ESP32").child("Humedad");
    humedad.on("value", (snapshot) => {
      this.setState({
        humidity: snapshot.val(),
      });
    });
    const digital = firebase.database().ref().child("ESP32").child("LED");
    digital.on("value", (snapshot) => {
      this.setState({
        led: snapshot.val(),
      });
    });
    const textString = firebase.database().ref().child("ESP32").child("Motor");
    textString.on("value", (snapshot) => {
      this.setState({
        text: snapshot.val(),
      });
    });
    // color =
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-light bg-light">
          <div className="navbar-brand">
            <img
              src={LOGO}
              width="30"
              height="30"
              class="d-inline-block align-top"
              alt=""
              loading="lazy"
            />
            Humedad
          </div>
        </nav>
        <div className="Body">
          <div className="row">
            <div className="col-6">
              <div className="text-center">
                <p className="Title">Proyecto sensor humedad</p>
              </div>
              <img src={SLIDER} width="680" height="300" />
            </div>
            <div className="col-6">
              <div className="text-center">
                <p className="Title">Datos del sensor en tiempo real</p>
              </div>
              <div>
                <p>
                  Se recibe los datos del sensor. Y se compara con los datos
                  preestablecidos para saber si esta muy humedo o muy seco de
                  esta manera prender una motobomba
                </p>
              </div>
              <p>Humedad Relativa: {this.state.humidity} %</p>

              <div className="row text-center ">
                <div style = {{alignItems: 'center', justifyContent: 'center'}}>
                  <p style={{ paddingLeft: 50, fontSize:15 }}>
                    El suelo esta muy seco se {this.state.text} motobomba: {" "}
                  </p>
                </div>
                
                <div style = {{alignItems: 'center', justifyContent: 'center'}}>
                  <p
                    style={{
                      backgroundColor: this.state.led,
                      borderRadius: 10,
                    }}
                  >
                    
                    Motor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
