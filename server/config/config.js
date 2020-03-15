//==================================================
//puerto
//==================================================
process.env.PORT = process.env.PORT || 3001

//==================================================
//entorno
//==================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==================================================
//base de datos
//==================================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
    //urlDB = 'mongodb+srv://johan:WYOIWECV3ssxBhyq@cluster0-mt4ib.mongodb.net/cafe';
} else {
    urlDB = 'mongodb+srv://johan:WYOIWECV3ssxBhyq@cluster0-mt4ib.mongodb.net/cafe';
}
process.env.URL_DB = urlDB;