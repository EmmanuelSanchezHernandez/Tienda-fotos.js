/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require('path')
const fs = require('fs')

module.exports = {
  
inicioSesion: async (req, res)=>{
    res.view('pages/admin/inicio_sesion')
},

procesarInicioSesion: async(req, res) =>{
    let admin = await Admin.findOne({email: req.body.email, contrasena: req.body.contrasena})
    if(admin){
        if(admin.activo){
            req.session.admin = admin
            req.session.cliente = undefined
            req.addFlash('mensaje', 'Sesion de admin iniciada')
            return res.redirect('/admin/principal')
        }else{
            req.addFlash('warning', 'Administrador desactivado. No puedes iniciar sesión')
            return res.redirect('/admin/principal')
        }
    }else{
        req.addFlash('mensaje', 'Email o contrasena invalidos')
        return res.redirect('/admin/inicio-sesion')
    }
},

principal: async (req, res)=>{
if(!req.session || !req.session.admin){
    req.addFlash('mensaje', 'Sesion invalida')
    return res.redirect('/admin/inicio-sesion')
}
let fotos = await Foto.find()
    res.view('pages/admin/principal', { fotos })
},

cerrarSesion: async(req, res)=>{
    req.session.admin = undefined
    req.addFlash("mensaje", 'Sesion admin finalizada')
    return res.redirect("/")
},

agregarFoto: async(req, res)=>{
    res.view('pages/admin/agregar_foto')
},

procesarAgregarFoto: async(peticion, respuesta)=>{
    let foto = await Foto.create({
        titulo: peticion.body.titulo,
        activa: false
      }).fetch()
  
  
      peticion.file('foto').upload({}, async (error, archivos) => {
        if (archivos && archivos[0]) {
            let upload_path = archivos[0].fd //SAILS GUARDA LA IMAGEN EN UNA  RUTA TEMPORTAL
            let ext = path.extname(upload_path) // OBTENEMOS LA EXTENSION DE LA RUTA TEMPORAL
    
            await fs.createReadStream(upload_path).pipe(fs.createWriteStream(path.resolve(sails.config.appPath, `assets/images/fotos/${foto.id}${ext}`)))
            await Foto.update({ id: foto.id }, { contenido: `${foto.id}${ext}`, activa: true })
            peticion.addFlash('mensaje', 'Foto agregada')
            return respuesta.redirect("/admin/principal")
          }
    
          peticion.addFlash('mensaje', 'No hay foto seleccionada')
          return respuesta.redirect("/admin/agregar-foto")
      })
      
},


        activarFoto: async (req, res)=>{
            await Foto.update({id: req.params.fotoId}, {activa: true})
            req.addFlash('mensaje', 'Foto activada')
            return res.redirect('/admin/principal')
        },

        desactivarFoto: async(req, res)=>{
            await Foto.update({id: req.params.fotoId}, {activa: false})
            req.addFlash('mensaje', 'Foto desactivada')
            return res.redirect('/admin/principal')
        },

        clientes: async (req, res)=>{
            if(!req.session || !req.session.admin){
                req.addFlash("mensaje", 'Sesión admin finalizada')
                return res.redirect("/")     
            }
            let clientes =  await Cliente.find()
            return res.view("pages/admin/clientes", {clientes})
        },

        ordenesClientes: async (req, res)=>{
            let ordenes = await Orden.find({cliente: req.params.clienteId})
            return res.view('pages/admin/ordenes_cliente', {ordenes})
        },

        fotosCliente: async (req, res)=>{
            if(!req.session || !req.session.admin){
                req.addFlash("mensaje", 'Sesión admin finalizada')
                return res.redirect("/")     
            }
            let query = `SELECT
            titulo,
            contenido,
            COUNT ( * ) AS cantidad
          FROM
            orden_detalle
            LEFT JOIN foto ON orden_detalle.foto_id = foto.ID
          GROUP BY
            titulo, contenido, foto_id
            ORDER BY 
            foto.ID`

            await OrdenDetalle.query(query, [], (err, result)=>{
                let fotos = result.rows
                res.view('pages/admin/fotos_cliente', {fotos})
            })
        },

        activarClientes: async(req, res)=>{
            if(!req.session || !req.session.admin){
                req.addFlash("mensaje", 'Sesión admin finalizada')
                return res.redirect("/")     
            }
            await Cliente.update({id: req.params.clienteId}).set({activo: true})
            req.addFlash('mensaje', 'Cliente activado con éxito')
            return res.redirect('/admin/clientes')
        },

        desactivarClientes: async (req, res)=>{
            if(!req.session || !req.session.admin){
                req.addFlash("mensaje", 'Sesión admin finalizada')
                return res.redirect("/")     
            }
            await Cliente.update({id: req.params.clienteId}).set({activo: false})
            req.addFlash('mensaje', 'Cliente desactivado con éxito')
            return res.redirect('/admin/clientes')
        },

        administradores: async(req, res)=>{
            if(!req.session || !req.session.admin){
                req.addFlash("mensaje", 'Sesión admin finalizada')
                return res.redirect("/") 
            }
           let administradores =  await Admin.find()
            return res.view('pages/admin/administradores', {administradores})
        },
        activarAdmin: async(req, res)=>{
            if(!req.session || !req.session.admin){
                req.addFlash("mensaje", 'Sesión admin finalizada')
                return res.redirect("/")     
            }
            let id = req.session.admin.id
            if(id != req.params.adminId){
                await Admin.update({id: req.params.adminId}).set({activo: true})
                req.addFlash('mensaje', 'Administrador activado con éxito')
                return res.redirect('/admin/administradores')
            }else{
                req.addFlash('warning', 'No puedes desactivarte o activarte a ti mismo')
                return res.redirect('/admin/administradores')
            }
            
        },

        desactivarAdmin: async (req, res)=>{
            if(!req.session || !req.session.admin){
                req.addFlash("mensaje", 'Sesión admin finalizada')
                return res.redirect("/")     
            }
            if(req.session.admin.id != req.params.adminId){
                await Admin.update({id: req.params.adminId}).set({activo: false})
            req.addFlash('mensaje', 'Administrador desactivado con éxito')
            return res.redirect('/admin/administradores')
            }else{
                req.addFlash('warning', 'No puedes desactivarte o activarte a ti mismo')
                return res.redirect('/admin/administradores')
            }
            
        },

        dashboard: async(req, res)=>{
            if(!req.session || !req.session.admin){
                req.addFlash("mensaje", 'Sesión admin finalizada')
                return res.redirect("/")     
            }

            let query = 'SELECT COUNT (id) AS cantidad FROM cliente'
            let query2 = 'SELECT COUNT (contenido) AS cantidadFoto FROM foto'
            let query3 = 'SELECT COUNT (id) AS cantidadOrden FROM orden_compra'
            let query4 = 'SELECT COUNT (id) AS cantidadAdmin FROM admin'
            var clientes
            var final
            await Cliente.query(query, [], (err, result)=>{
                 clientes = result.rows
                    Foto.query(query2, [], (err, result2)=>{
                        fotos = result2.rows
                        Orden.query(query3, [], (err, result3)=>{
                            ordenes = result3.rows
                                Admin.query(query4, [], (err, result4)=>{
                                   adminis = result4.rows 
                                   final = {clientes: clientes[0], fotos: fotos[0], ordenes: ordenes[0], admin : adminis[0]}
                                    console.log(final)
                                    res.view('pages/admin/dashboard', {final})
                                })
                        })
                    })
            })

        }



};

