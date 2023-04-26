const admin = require('../models/adminModel');
// Getting Category //
const category = require('../models/categoryModel');
// Getting Products //
const product = require('../models/productModel');
const Banner = require('../models/bannerModel');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const showCategory = async(req,res,next)=> {
  try {
    const categories = await category.find({});
    if(req.session.admin_id){
      res.render('category',{ category : categories })
    }
    else
    {
      res.redirect('/admin')
    }
  } catch (error) {
    next(error.message)
  }
}

const createCategory = async(req,res,next)=> {
  try {
    if(req.session.admin_id){
      res.render('addCategory')
    }
    else{
      res.redirect('/admin')
    }
  } catch (error) {
    next(error.message)
  }
}

const addCategory = async (req, res, next) => {
  try {
      let newCategory = req.body.category;
      newCategory =newCategory.trim()
      let capData = newCategory.toUpperCase()
      console.log(newCategory);
      const categories = await category.find({ name: capData });
      if (categories.length > 0) {
        res.render('addCategory', { message: "Category Already Exist" });
      } else if (
        req.body.category.trim() == '' ||
        req.body.description.trim() == ''
      )
       {
        res.render('addCategory', { message: "Fields Can't Be Empty" });
      } else {
        const newCategoryData = new category({
          name: req.body.category,
          description: req.body.description,
        });
        const categoryData = await newCategoryData.save();
        if (categoryData) {
          const categories = await category.find();
          res.render('category', { category: categories });
        } else {
          console.log('Operation Failed');
        }
    }
  } catch (error) {
    next(error.message);
  }
};



const deleteCategory = async(req,res,next)=>{
  try {
    if(req.session.admin_id){
      const id = req.query.id
      const catogeries = await category.deleteOne({_id:id})
      res.redirect('/admin/category')
    }
  } catch (error) {
    console.log(error.message);
    next(error.message);
  }
}

const editCategory = async(req,res,next)=> {
  try {
    if(req.session.admin_id){
      const id = req.query.id;
      const catogeries = await category.findById({_id:id})
      res.render('editCategory', { catogeries })
    }
  } catch (error) {
    next(error.message)
  }
}

const updateCategory = async(req,res,next)=> {
  try {
    if(req.session.admin_id){
      const updatedCategory = await category.findOneAndUpdate({_id:req.body.id},{$set:{name:req.body.category,description:req.body.description}})
    }
    res.redirect('/admin/category')
  } catch (error) {
    next(error.message)
  }
}

// const updateCategory = async(req,res,next)=>{
//   try {
//     if(req.session.admin_id){
//       if(req.files){
//         const updateCategory = await category.findByIdAndUpdate({_id:req.body.id},{$set:{image:req.body.image}});

//       }
//       else{
//         const updateCategory = await category.findOneAndUpdate({_id:req.body.id},{$set:{name:req.body.category}});
//         console.log(req.body.id);
//       }
//       res.redirect('/admin/category')
//     }
//   } catch (error) {
//     console.log(error.message);
//     next(error.message);
//   }
// } 

const categoryControl = async(req,res,next)=>{
  try {
    const id = req.query.id;

    const categoryStatus = await category.findOne({_id:id})
    
    if(categoryStatus.status){

      await category.updateOne({_id:id},{$set:{status:false}})
      
    }
    else{
      await category.updateOne({_id:id},{$set:{status:true}})
    }
    res.redirect('/admin/category')
  } catch (error) {
    next(error.message)
  }
}


module.exports = {
  showCategory,
  createCategory,
  addCategory,
  deleteCategory,
  editCategory,
  updateCategory,
  categoryControl,
}