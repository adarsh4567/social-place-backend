const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const helmet = require('helmet');
const multer = require('multer')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post'); 
const userRoutes = require('./routes/users')
const { register } = require('./controllers/auth');
const { createPost } = require('./controllers/post');
const verifyToken = require('./middlewares/auth');
// const User = require('./models/User')
// const Post = require('./models/Post')
// const {users,posts} = require('./data/index');


// configurations:


dotenv.config()
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan('common'));
app.use(bodyParser.json({limit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,"public/assets")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    },
})

const upload = multer({storage})

// Routes

app.post("/auth/register",upload.single("picture"),register);
app.post('/posts',verifyToken,upload.single("picture"),createPost)


app.use('/auth',authRoutes)
app.use('/users',userRoutes)
app.use('/posts',postRoutes)


// database connection
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    app.listen(PORT,()=> console.log(`Server running at ${PORT}`))
}).catch((err)=> console.log(err))
