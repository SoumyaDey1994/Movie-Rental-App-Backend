const mongoose= require('mongoose');

let id= new mongoose.Types.ObjectId;
console.log(`New Object Id: ${id}`);
console.log(`Time of Object Id creation: ${id.getTimestamp()}`);

let arbitaryObjId= '5b0ew618074c203bd823f1c2';
console.log(`Object Id ${arbitaryObjId} is a valid object id: ${mongoose.Types.ObjectId.isValid(arbitaryObjId)}`);