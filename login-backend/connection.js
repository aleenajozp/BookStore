const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://aleenajozph:aleena@cluster0.bu3kod3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Database connection is successfull!")
})
.catch((err)=>{
    console.log(err)
}
)
