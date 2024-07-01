import {config as conf} from 'dotenv'

conf();


if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
}

if (!process.env.DB_URI) {
    throw new Error("Missing databaseurl in environment variables");
}

if (!process.env.JWT_EXPIRE) {
    throw new Error("Missing JWT_SECRET in environment variables");
}

if (!process.env.SMPT_HOST ||
    !process.env.SMPT_PORT ||
    !process.env.SMPT_SERVICE ||
    !process.env.SMPT_MAIL ||
    !process.env.SMPT_PASSWORD
) {
    throw new Error("Missing SMTP values in environment variables");
}

if (!process.env.CLOUDINARY_NAME||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
) {
    throw new Error("Missing cloudinary values in environment variables");
}

if (!process.env.STRIPE_API_KEY||
    process.env.STRIPE_SECRET_KEY
) {
    throw new Error("Missing stripe values in environment variables");
}

const _config={
   port:process.env.PORT,  
   // we cannot import value from .env as per some rule so we installed dotenv packege and imported it
   databaseurl:process.env.DB_URI,
   env:process.env.NODE_ENV,
   jwtSecret:process.env.JWT_SECRET as string,
   jwtExpire:process.env.JWT_EXPIRE as string,
//    cookieExpire:process.env.COOKIE_EXPIRE as number,
   smtpHost:process.env.SMPT_HOST,
   smtpPort:process.env.SMPT_PORT,
   smtpService:process.env.SMPT_SERVICE,
   smtpMail:process.env.SMPT_MAIL,
   smtpPassword:process.env.SMPT_PASSWORD,
   stripeSecretKey:process.env.STRIPE_SECRET_KEY,
   stripeApiKey:process.env.STRIPE_API_KEY,
   cloudinaryCloud:process.env.CLOUDINARY_NAME,
   cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
   clouddinnaryApiSecret:process.env.CLOUDINARY_API_SECRET,
   
};

export const config = Object.freeze(_config);
// its a best practice to organise all regular uses variable in one place
// freze gives power to read only capability to the obeject no one can modify that in another file