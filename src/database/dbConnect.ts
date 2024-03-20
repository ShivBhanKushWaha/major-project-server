import mongoose from "mongoose";

const dbConnect = (url : any) => {
    mongoose.connect(url)
    .then(()=> {
        console.log('db is connected');
    })
    .catch((err)=>{
        console.log('server got error',err);
    });
}

export default dbConnect
