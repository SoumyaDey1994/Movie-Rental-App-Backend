const bcrypt= require('bcrypt');

const password='Soumya@1994'
async function hashPassword(){
    const salt= await bcrypt.genSalt(15);
    console.log(`Salt= ${salt}`);
    console.log(`Hashed Password: ${await bcrypt.hash(password, salt)}`);
}

hashPassword();