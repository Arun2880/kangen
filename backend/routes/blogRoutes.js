const express=require('express');

const router=express.Router();

const {Addblog,Getblogs,Deleteblog}=require('../controllers/Blog_controller');

router.post('/addblog',Addblog);
router.get('/bloglist',Getblogs);
router.delete('/delblog/:id',Deleteblog);

module.exports=router;