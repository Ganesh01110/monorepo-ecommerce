import {config as conf} from 'dotenv'
conf();

const _config={
   port:process.env.PORT,  
   // we cannot import value from .env as per some rule so we installed dotenv packege and imported it
   databaseurl:process.env.DB_URI,
//    env:process.env.NODE_ENV,
//    jwtSecret:process.env.JWT_SECRET,
//    cloudinaryCloud:process.env.CLOUDINARY_CLOUD,
//    cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
//    clouddinnaryApiSecret:process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
// its a best practice to organise all regular uses variable in one place
// freze gives power to read only capability to the obeject no one can modify that in another file