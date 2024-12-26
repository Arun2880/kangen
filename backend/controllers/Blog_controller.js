const { truncate } = require('fs');
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');

// Set up Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');  
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only images are allowed!');
        }
    }
}).single('image');  

const Addblog = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }

        const { title1, deatils1, title2, deatils2, deatils3 } = req.body;

        try {
            if (!req.file || !title1 || !deatils1) {
                return res.status(400).json({
                    error: true,
                    message: "Image, title1, and deatils1 are required"
                });
            }

            const newBlog = new Blog({
                title1,
                deatils1,
                title2,
                deatils2,
                deatils3,
                image: req.file.filename 
            });

            await newBlog.save();

            return res.status(200).json({
                error: false,
                message: "Blog added successfully",
                data: newBlog
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Internal server error"
            });
        }
    });
};



// ------------------------get all blogs---------------------

const Getblogs=async(req,res)=>{
    try{


        const Blogdata=await Blog.find({is_deleted:{$ne:1}});

        if(Blogdata.length===0){
            return res.status(404).json({
                error:true,
                message:"Blog not found"
            })
        }


        return res.status(200).json({
            error:false,
            message:"Blog list here",
            data:Blogdata
        })

    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
    }
}


// -------------------------------------- Delete Blog-------------------------------

const Deleteblog=async(req,res)=>{
    const {id}=req.params;

    try{

        if(!id){
            return res.status(400).json({
                error:true,
                message:"Something went wrong || ID is Missing"
            })
        }

const delblog=await Blog.findByIdAndUpdate(id,{is_deleted:1},{new:true});
if(!delblog){
    return res.status(404).json({
        error:true,
        message:"Blog Not delete"
    })
}

return res.status(200).json({
    error:false,
    message:"Blog deleted successfully",
    data:delblog
})


    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
    }
}



module.exports = { Addblog,Getblogs,Deleteblog };
