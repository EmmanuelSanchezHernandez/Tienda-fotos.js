/**
 * ListaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  
    agregarListaDeseo: async (peticion, respuesta) => {
        let foto = await ListaDeseo.findOne({ foto: peticion.params.fotoId, cliente: peticion.session.cliente.id })
        if (foto) {
          peticion.addFlash('mensaje', 'La foto ya había sido agregada a la lista de deseo')
        }
        else {
          await ListaDeseo.create({
            cliente: peticion.session.cliente.id,
            foto: peticion.params.fotoId
          })
          peticion.addFlash('mensaje', 'Foto agregada a la lista de deseo')
        }
        return respuesta.redirect("/")
      },
    
      listaDeseo: async (peticion, respuesta) => {
        if (!peticion.session || !peticion.session.cliente) {
          return respuesta.redirect("/")
        }
        let elementos = await ListaDeseo.find({ cliente: peticion.session.cliente.id }).populate('foto')
        respuesta.view('pages/lista_deseo', { elementos })
      },
    
      eliminarListaDeseo: async (peticion, respuesta) => {
        let foto = await ListaDeseo.findOne({ foto: peticion.params.fotoId, cliente: peticion.session.cliente.id })
        if (foto) {
          await ListaDeseo.destroy({
            cliente: peticion.session.cliente.id,
            foto: peticion.params.fotoId
          })
          peticion.addFlash('mensaje', 'Foto eliminada de la lista de deseo')
        }
        return respuesta.redirect("/lista-deseo")
      },

};

