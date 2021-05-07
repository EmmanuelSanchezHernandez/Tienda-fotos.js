/**
 * CompraController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    comprar: async (peticion, respuesta) => {
        let orden = await Orden.create({
          fecha: new Date(),
          cliente: peticion.session.cliente.id,
          total: peticion.session.carroCompra.length
        }).fetch()
        for(let i=0; i< peticion.session.carroCompra.length; i++){
          await OrdenDetalle.create({
            orden: orden.id,
            foto: peticion.session.carroCompra[i].foto
          })
        }
        await CarroCompra.destroy({cliente: peticion.session.cliente.id})
        peticion.session.carroCompra = []
        peticion.addFlash('mensaje', 'La compra ha sido realizada')
        return respuesta.redirect("/")
      },
      agregarCarroCompra: async (peticion, respuesta) => {
        let foto = await CarroCompra.findOne({ foto: peticion.params.fotoId, cliente: peticion.session.cliente.id })
        if (foto) {
          peticion.addFlash('mensaje', 'La foto ya había sido agregada al carro de compra')
        }
        else {
          await CarroCompra.create({
            cliente: peticion.session.cliente.id,
            foto: peticion.params.fotoId
          })
          peticion.session.carroCompra = await CarroCompra.find({ cliente: peticion.session.cliente.id })
          peticion.addFlash('mensaje', 'Foto agregada al carro de compra')
        }
        return respuesta.redirect("/")
      },
      carroCompra: async (peticion, respuesta) => {
        if (!peticion.session || !peticion.session.cliente){
          return respuesta.redirect("/")
        }
        let elementos = await CarroCompra.find({ cliente: peticion.session.cliente.id }).populate('foto')
        respuesta.view('pages/carro_de_compra', {elementos})
      },

      eliminarCarroCompra: async (peticion, respuesta) => {
        let foto = await CarroCompra.findOne({ foto: peticion.params.fotoId, cliente: peticion.session.cliente.id })
        if (foto) {
          await CarroCompra.destroy({
            cliente: peticion.session.cliente.id,
            foto: peticion.params.fotoId
          })
          peticion.session.carroCompra = await CarroCompra.find({ cliente: peticion.session.cliente.id })
          peticion.addFlash('mensaje', 'Foto eliminada del carro de compra')
        }
        return respuesta.redirect("/carro-de-compra")
      },

      comprar: async (req,res)=>{
        console.log("HERE")
        console.log(req.session.carroCompra)
        console.log(req.session.carroCompra.length)
        let orden = Orden.create({
          fecha: new Date(),
          total: req.session.carroCompra.length,
          cliente: req.session.cliente.id
        }).fetch()
        console.log(orden)
        for(let i=0; i<req.session.carroCompra.length; i++){
          await OrdenDetalle.create({
            orden: req.session.orden.id,
            foto: req.session.carroCompra[i].foto
          })
        }

        await CarroCompra.destroy({cliente: req.session.cliente.id})
        req.session.carroCompra = []
        req.addFlash('mensaje', 'La compra ha sido realizada')
        return res.redirect("/")
      },

      misOrdenes: async (req, res)=>{
        if(!req.session || !req.session.cliente){
          return res.redirect("/")
        }
        let ordenes = await Orden.find({cliente: req.session.cliente.id}).sort('id desc')
        console.log(ordenes)
        res.view('pages/mis_ordenes', {ordenes})
      },

      ordenDeCompra: async (peticion, respuesta) => {
        if (!peticion.session || !peticion.session.cliente) {
          return respuesta.redirect("/")
        }
        let orden = await Orden.findOne({ cliente: peticion.session.cliente.id, id: peticion.params.ordenId }).populate('detalles')
    
        if (!orden) {
          return respuesta.redirect("/mis-ordenes")
        }
    
        if (orden && orden.detalles == 0) {
          return respuesta.view('pages/orden', { orden })
        }
    
        orden.detalles = await OrdenDetalle.find({ orden: orden.id }).populate('foto')
        return respuesta.view('pages/orden', { orden })
      },

};

