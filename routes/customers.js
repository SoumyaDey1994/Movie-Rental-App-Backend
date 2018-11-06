const express= require('express');

const {Customer, validate }= require('../models/customer');

const router= express.Router();

//Get all customer objects
router.get('/', async (req, res)=>{
    try{
        const customers= await Customer.find()
                                       .sort({name: 1})
        return res.status(200).send(customers);
    }catch(err){
        return res.status(500).send({'error':err});
    }
})
//get specific customer bu id
router.get('/:id', async (req, res)=>{
    const customerId= req.params.id;
    try{
        const customer= await Customer.findById(customerId);
        if(!customer)
            return res.status(404).send({'Error':`Customer having Id ${customerId} does not exists`});
        return res.status(200).send(customer);
    }catch(err){
        return res.status(500).send({'error':err});
    }
})

//Create a new customer object
router.post('/', async (req, res)=>{
    const validationResult= validate(req.body);
    if(validationResult.error)
        return res.status(400).send({'Error':validationResult.error.details[0].message});
    try{
        let customer= req.body;
        customer= await new Customer(customer).save();
        return res.status(200).send({'Customer Creation':'Success','Customer':customer});
    }catch(err){
        return res.status(500).send({'Error':err});
    }
})

//update an existing customer object
router.put('/:id', async (req, res)=>{
    const validationResult= validate(req.body);
    if(validationResult.error)
        return res.status(400).send({'Error':validationResult.error.details[0].message});
    try{
        const customerId= req.params.id;
        const customer= await Customer.findByIdAndUpdate(customerId, {
                isGold: req.body.isGold,
                name: req.body.name,
                phone: req.body.phone
    },{
            new: true
        })

        if(!customer)
            return res.status(404).send({"Error":`Customer having id ${customerId} does not exists`});

        return res.status(200).send({"Updated customer":customer});

    }catch(err){
        console.log(`Error in updating customer : ${err}`);
        return res.status(500).send({'error':err});
    }
})

//delete an customer object
router.delete('/:id', async (req, res)=>{
    const customerId= req.params.id;
    try{
        const customer= await Customer.findByIdAndRemove(customerId);
        if(!customer)
            return res.status(404).send({'Error':`Customer having Id ${customerId} does not exists`});

        return res.status(200).send({'Deleted Customer':customer});
    }catch(err){
        console.log(`Error in deleting customer : ${err}`);
        return res.status(500).send({'Error':err});
    }
})

//export the router object
module.exports= router;

