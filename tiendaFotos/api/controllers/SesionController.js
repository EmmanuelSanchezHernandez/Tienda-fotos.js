/**
 * SesionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    registro: async (req, res)=>{
        res.view('pages/registro')
    },

    procesarRegistro: async (req, res)=>{
        let cliente =await Cliente.findOne({ email: req.body.email});
        if(cliente){
            req.addFlash('mensaje', 'Email duplicado')
            return res.redirect('/registro')
        }else{
            let cliente = await Cliente.create({
                email: req.body.email,
                nombre: req.body.nombre,
                contrasena: req.body.contrasena
            })
            req.session.cliente = cliente
            return res.redirect("/")
        }
    },
    
    inicioSesion: async (peticion, respuesta) => {
        respuesta.view('pages/inicio_sesion')
      },
    
      procesarInicioSesion: async (peticion, respuesta) => {
        let cliente = await Cliente.findOne({ email: peticion.body.email, contrasena: peticion.body.contrasena });
        if (cliente && cliente.activo) {
          peticion.session.cliente = cliente
          let carroCompra = await CarroCompra.find({cliente: cliente.id})
          peticion.session.carroCompra = carroCompra
          peticion.addFlash('mensaje', 'Sesión iniciada')
          console.log(peticion.session.cliente)
          return respuesta.redirect("/")
        }
        else if(cliente.activo == false){
          peticion.addFlash('mensaje', 'Cliente desactivado, contáctate con el administrador del sitio para saber más')
          return respuesta.redirect("/inicio-sesion");
        }else{
          peticion.addFlash('mensaje', 'Email o contraseña invalidos')
          return respuesta.redirect("/inicio-sesion");
        }
      },
    
      cerrarSesion: async (peticion, respuesta) => {
        peticion.session.cliente = undefined;
        peticion.addFlash('mensaje', 'Sesión finalizada')
        return respuesta.redirect("/");
      },

};

