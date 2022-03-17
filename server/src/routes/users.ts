import express from "express";
const router = express.Router();

import { v4 as uuidv4 } from 'uuid';

import data from '../../data.json';

type User = {

    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: number;
    address: string;
}

//SENDS ALL MEMBERS
router.get("/", (req, res) => {

    res.status(200).json(data);

});

//SEND A SPECIFIC MEMEBER 
router.get("/:id", (req, res) => {

    let id = req.params.id;
    if (data.some(data => data.id === id)) {
        res.status(200).json(data.filter(data => data.id === id))
    }
    else
        res.status(404).json({ message: `No Member with Member ID ${id} Found` });
         //404 - not found

})

//ADD MEMBER
router.post("/", (req, res) => {

    const newMember: User = {
        id: uuidv4(),
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        address: req.body.address


    }
    if (!newMember.firstName || !newMember.lastName || !newMember.email || !newMember.phoneNumber || !newMember.role || !newMember.address) {
        res.status(400).json({ message: `Give Correct Input` })
    }
    else if (data.some(data => newMember.phoneNumber === data.phoneNumber)) {
        res.status(400).json({ message: `User Already Exists` })
    }

    else {
        data.push(newMember);
        res.status(201).json({ message: `Member Successfully Added !`, "New Member": newMember });
    }



})

//EDIT MEMBER

router.put('/:id', (req, res) => {
    let id = req.params.id;
    if (data.some(data => data.id === id)) {


        data.forEach(object => {
            if (object.id === id) {
                object.firstName = req.body.firstName ? req.body.firstName : object.firstName
                object.middleName= req.body.middleName ? req.body.middleName : object.middleName
                object.lastName = req.body.lastName ? req.body.lastName : object.lastName
                object.email = req.body.email ? req.body.email : object.email
                object.phoneNumber = req.body.phoneNumber? req.body.phoneNumber: object.phoneNumber
                object.role = req.body.role ? req.body.role : object.role
                object.address = req.body.address ? req.body.address : object.address
                res.status(200).json({ message: 'Updated Successfully', updatedMembers: data });
            }
        })
    }
    else {
        
        res.status(404).json({ message: `No Member with Member ID ${id} Found` });
    }
})

//DELETE MEMBER
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    if (data.some(data => data.id === id)) {

        let index = 0;
        
        for (; index < data.length; index++) {
            if (data[index].id === id)
                break;
        }
        data.splice(index, 1);
        res.status(200).json({ message: `Deleted Member with ID: ${id}`, members: data });
        console.log(id);
    }
    else {
        res.status(404).json({ message: `No Member with Member ID ${id} Found` });
    }


})

module.exports = router;