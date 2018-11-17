/**
 * Archivo para declarar constantes 
 */

 /**
  * Puerto
  */

  process.env.PORT= process.env.PORT || 3000;

  process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

  let urlDB;

  if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe';
  }else{
    urlDB='mongodb://cafe-user:admin12345@ds139949.mlab.com:39949/cafe_dexcover';
  }
  
 process.env.URLDB = urlDB;
