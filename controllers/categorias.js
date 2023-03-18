import { request, response } from "express";

import { Categoria } from "../models/index.js";

//Obtener todas las categorias
const obtenerCatgs = async(req = request, res = response) =>{
    
    const {paginado = 10, desde = 0} = req.query;

    try {
        
        const [total, catgs] = await Promise.all([
            Categoria.countDocuments({estado:true}),
            Categoria.find({estado:true})
                .skip(Number(desde))
                .limit(Number(paginado))
                .populate('usuario', 'nombre')
        ]);

        res.json({
            msg: 'Obtener Categorias',
            total,
            catgs
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se obtuvieron las Categorias'
        });
    }
    
};

//Obtener una categoria por id
const obtenerCatg = async(req = request, res = response) =>{
    
    const { id } = req.params;

    try {
        const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

        res.json({
            msg: 'Obtener Categoria',
            categoria
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se obtuvo la Categoría'
        });
    }
};

//Crear una categoria
const crearCatg = async(req = request, res = response) =>{

    const nombre = req.body.nombre.toUpperCase();

    try {
        const categoriaDB = await Categoria.findOne({nombre});

        if( categoriaDB ){
            return res.status(400).json({
                msg: `La categoría ${categoriaDB.nombre}, ya existe `
            });
        }

        //Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id
        }

        const categoria = new Categoria( data );

        //Guardar DB
        await categoria.save();

        res.status(201).json({
            msg: 'Categoría Creada',
            data
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se creó la Categoría'
        });
    }
};

//Actualizar una categoria
const actualizarCatg = async(req = request, res = response) =>{
  
    try {

        const { id } = req.params;
        const {estado, usuario, ...catgActualizada} = req.body;

        catgActualizada.nombre = catgActualizada.nombre.toUpperCase();
        catgActualizada.usuario = req.usuario._id;

        const nombre = catgActualizada.nombre;  

        const categoriaDB = await Categoria.findOne({nombre});

        if( categoriaDB ){
            return res.status(400).json({
                msg: `La categoría ${categoriaDB.nombre}, ya existe `
            });
        }

        const updateCatg = await Categoria.findByIdAndUpdate(id, catgActualizada,{new: true});

        res.json({
            msg: 'Actualizar Categoría',
            updateCatg
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se actualizó la Categoría'
        });
    }
};

//Borrar una categoria por id
const borrarCatg = async(req = request, res = response) =>{

    const {id} = req.params;

    try {

        const catg = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true});

        res.status(200).json({
            msg: 'Borrar Categoría',
            catg
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No se borró la Categoría'
        });
    }
};

export {obtenerCatgs, obtenerCatg, crearCatg, actualizarCatg, borrarCatg};