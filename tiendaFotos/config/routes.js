/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

   'GET /': 'PrincipalController.inicio',
  '/acerca-de': {view: 'pages/acerca-de'},
  'GET /registro': 'SesionController.registro',
  'POST /procesar-registro': 'SesionController.procesarRegistro',
  
  'GET /inicio-sesion': 'SesionController.inicioSesion',

  'GET /cerrar-sesion': 'SesionController.cerrarSesion',

  'POST /procesar-inicio-sesion': 'SesionController.procesarInicioSesion',

  'GET /comprar': 'CompraController.comprar',

  'GET /agregar-carro-compra/:fotoId': 'CompraController.agregarCarroCompra',

  'GET /carro-de-compra': 'CompraController.carroCompra',

  'GET /eliminar-carro-compra/:fotoId': 'CompraController.eliminarCarroCompra',

  'GET /mis-ordenes': 'CompraController.misOrdenes',

  'GET /mis-ordenes/:ordenId': 'CompraController.ordenDeCompra',

  'GET /top-vendidas': 'PrincipalController.topVendidas',

  'GET /agregar-lista-deseo/:fotoId': 'ListaController.agregarListaDeseo',

  'GET /lista-deseo': 'ListaController.listaDeseo',

  'GET /eliminar-lista-deseo/:fotoId': 'ListaController.eliminarListaDeseo',

  'GET /admin/inicio-sesion': 'AdminController.inicioSesion',

  'POST /admin/procesar-inicio-sesion': 'AdminController.procesarInicioSesion',

  'GET /admin/principal': 'AdminController.principal',

  'GET /admin/cerrar-sesion': 'AdminController.cerrarSesion',

  'GET /admin/agregar-foto': 'AdminController.agregarFoto',

  'POST /admin/procesar-agregar-foto': 'AdminController.procesarAgregarFoto',

  'GET /admin/activar-foto/:fotoId': 'AdminController.activarFoto',

  'GET /admin/desactivar-foto/:fotoId': 'AdminController.desactivarFoto',

  'GET /admin/clientes': 'AdminController.clientes',

  'GET /admin/ordenes-cliente/:clienteId': 'AdminController.ordenesClientes',

  'GET /admin/fotos-cliente/:clienteId': 'AdminController.fotosCliente',

  'GET /admin/activar-cliente/:clienteId': 'AdminController.activarClientes',

  'GET /admin/desactivar-cliente/:clienteId': 'AdminController.desactivarClientes',

  'GET /admin/administradores': 'AdminController.administradores',

  'GET /admin/desactivar-admin/:adminId': 'AdminController.desactivarAdmin',

  'GET /admin/activar-admin/:adminId': 'AdminController.activarAdmin',

  'GET /admin/dashboard': 'AdminController.dashboard',



  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
