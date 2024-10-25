/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
   domains: [
    'res.cloudinary.com', 
    "https://whatsappbackend-uqtf.onrender.com", 
    "localhost"],
  }
 };
 
 export default nextConfig;

//if hosting online add domain of server in domains for images once deploying.