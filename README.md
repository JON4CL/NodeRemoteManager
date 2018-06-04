![Project Logo](http://gitlab.devchile.ncr.com/ja185203/SRM/raw/2ec6d8a67d277c8261d92f2696b7749d340c85ee/public/dist/img/srm_logo_256.png)

# SRM (Simple Remote Manager)

Sistema basado en nodejs, Angular, Bootstrap que permite el acceso a la información del sistema del host remotamente a traves de llamadas HTTP, con una Interfaz Web como cliente.

## Getting Started

La idea del proyecto es tener un "agente" en el host que permita el acceso a la información del sistema.
El "Agente" es un modulo de nodejs corriendo en el host el cual obtiene información del sistema y la expone a traves de servicios HTTP para ser consumida por algun cliente.
El sistema cuenta con una Interfaz Web para el cliente para visualizar la información y acceder a los diferentes servicios expuestos por el "Agente"

### Features

* List directories availables in the host
* List Files in the host drives 
* Download/Get Files from the host
* Upload Files to the host
* List events in Windows Eventlog in the host

## Deployment

Para implementar el sistema se debe clonar el repositorio y ejecutar la siguiente linea de codigo:

```
node ./bin/main.js
```

## Built With

* [NodeJS 6.9.4](https://nodejs.org/es/)
* [Angular v1.6.1](https://angularjs.org/)
* [Bootstrap v3.3.7](http://getbootstrap.com/) - Used to generate RSS Feeds

## Authors

* **Jonathan Araneda** - *Initial work* - (http://gitlab.devchile.ncr.com/u/ja185203)

## License