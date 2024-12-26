
const Category = require('../../models/category/category');

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name} = req.body;
        const category = new Category({ name, });
        await category.save();
        res.status(201).json({ message: 'Category created', category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
     
      const categories = await Category.find({ is_deleted: { $ne: true } });
  
   
      if (categories.length === 0) {
        return res.status(400).json({
          error: true,
          message: "Categories not found",
        });
      }
  
     
      return res.status(200).json({
        error: false,
        message: "Category list",
        data: categories,
      });
  
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };


  const Deletecategory=async(req,res)=>{
    const {id}=req.params;

    try{


        if(!id){
            return res.status(400).json({
                error:true,
                message:"Something went wrong || ID missing"
            })
        }

        const delcategory=await Category.findByIdAndUpdate(id,{is_deleted:1},{new:true});

     return res.status(200).json({

        error:false,
        message:"Category deleted successfully",
        data:delcategory
     })


    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
    }
  };


const Updatecategory= async(req,res)=>{


    const {id}=req.params;
const {name}=req.body;
    try{

      if(!id){
        return res.status(400).json({
          error:true,
          message:"Id not found"
        })
      }

const updatename={
  name:name
}
      
      const updatecare=await Category.findByIdAndUpdate(id,updatename,{new:true});
      if(!updatecare){
        return res.status(404).json({
          error:true,
          message:"Product not updated !",
          data:[null]
        })
      }

      return res.status(200).json({
        error:false,
        message:"Category updated successfully",
        data:[updatecare]
      })

    }catch(error){
      return res.status(500).json({
        error:true,
        message:"Internal server error"
      })
    }

  }





module.exports={createCategory,getAllCategories,Deletecategory,Updatecategory};
