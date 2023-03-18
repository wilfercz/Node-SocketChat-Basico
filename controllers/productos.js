import { request, response } from "express";

import { Producto} from "../models/index.js";

//Obtener todas las categorias
const obtenerProducts = async(req = request, res = response) =>{

    try {
        const {paginado = 0, desde = 0} = req.query;

        const [total, pdts] = await Promise.all([
            Producto.countDocuments({estado:true}),
            Producto.find({estado:true})
                .skip(Number(paginado))
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ]);

        res.json({
            msg: 'Obtener Productos',
            total,
            pdts
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se obtuvieron los Productos'
        });
    }
};

//Obtener un productor por id
const obtenerProduct = async(req = request, res = response) =>{

    try {
        const {id} = req.params;

        const productos = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

        res.json({
            msg: 'Obtener Producto',
            productos
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se obtuvo el Producto'
        });
    }
};

//Crear un producto
const crearProduct = async(req = request, res = response) =>{

    try {

        const {estado, usuario, ...body} = req.body;

        const productoDB = await Producto.findOne({nombre: body.nombre});

        if( productoDB ){
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre}, ya existe `
            });
        }

        //Generar la data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id,
        }

        const producto = new Producto(data);

        await producto.save();

        res.status(201).json({
            msg: 'Crear Producto',
            producto
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se creó el Producto'
        });
    }
};

//Actualizar un producto
const actualizarProduct = async(req = request, res = response) =>{
  
    try {

        const { id } = req.params;
        const {estado, usuario, ...prodActualizada} = req.body;

        prodActualizada.nombre = prodActualizada.nombre.toUpperCase();
        
        prodActualizada.usuario = req.usuario._id;

        const updateProd = await Producto.findByIdAndUpdate(id, prodActualizada,{new: true});

        res.json({
            msg: 'Actualizar Producto',
            updateProd
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se actualizó el Producto'
        });
    }
};

//Borrar una categoria por id
const borrarProduct = async(req = request, res = response) =>{

    try {

        const {id} = req.params;

        const prd = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});

        res.status(200).json({
            msg: 'Borrar Producto',
            prd
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se borró el Producto'
        });
    }
};

export {obtenerProduct, obtenerProducts, crearProduct, actualizarProduct, borrarProduct};