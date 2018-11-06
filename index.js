const config= require('config');
const joi= require('joi');
joi.objectId= require('joi-objectid')(joi);

const express= require('express');
const morgan= require('morgan');
const ejs= require('ejs');
const debug= require('debug')('app:vidly');
require('express-async-errors');

const app= express();

require('./startup/routes')(app);   //calling route module
require('./startup/db')();            // calling db module
require('./startup/logging')();     //calling logging error module

const port= process.env.port|| process.env.PORT|| 7878;
const hostName='localhost';

if(!config.get('mail.password')){
    console.log(`mail password is not defined`);
    process.exit(1);
}else if(!config.get('jwtPrivateKey')){
    console.log(`JWTPrivateKey is not defined`);
    process.exit(1);
}
// //caught ungandled exceptions
// process.on('uncaughtException', (ex)=>{
//     console.log("We got an uncaught exception");
//     winston.error(ex.message, ex);
//     process.exit(1)
// })

//Check Environment
debug(`Current Environment: ${app.get('env')}`);

//Check Configuration Settings
debug(`App Name: ${config.get('name')}`);
debug(`Mail Server Name: ${config.get('mail.host')}`);
debug(`Mail Server Password: ${config.get('mail.password')}`)
debug(`JWT Secret Key: ${config.get('jwtPrivateKey')}`)

// throw an error outside the context of middleware
    // throw new Error('Something failed during Start of Application');
//thow an unhandle promise rejection 
    // let prom= Promise.reject(new Error('Unhandled Promise Rejection'));
    // prom.then(()=>console.log('Promise passed successfully'));



//Enable morgan only if environment is development
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    debug(`Morgan Enabled`);
}

app.set('layout', 'layout/layout');
app.set('view engine', 'ejs');


app.listen(port, ()=>console.log(`Server listening to http://${hostName}:${port}`));
