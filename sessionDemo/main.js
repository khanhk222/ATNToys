var express = require('express')//package thu vien
var session = require('express-session')
var app = express()
var mongoClient = require('mongodb').MongoClient//ket noi database
var url = 'mongodb://127.0.0.1:27017'
const { MongoClient } = require('mongodb')
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'Toy',
    resave: false
}))
function isAuthenticated(req, res, next) {
    let notLogin = !req.session.userName
    if (notLogin)
        res.redirect('/')
    else
        next()
}
//home
app.get('/',async (req,res)=> {
    let server = await MongoClient.connect(url)//ket noi mongodb
    let dbo = server.db("ATNToys")//ket noi vs database atntoys
    let result = await dbo.collection("Toys").find().toArray();//lay du lieu tu Toys chuyen thanh mang de render ra trang home
    res.render('home',{'result': result })
})
//insert
app.get('/Insert',(req,res)=>{
    res.render('newProduct')
})
//check insert
app.post('/checkInsertProduct', async(req,res)=>{
    let name = req.body.name
    let price = req.body.price
    let quantity = req.body.quantity
    let image = req.body.image
    let Toy = {
        'name': name,
        'price': price,
        'quantity': quantity,
        'image': image,
    }

    let server = await MongoClient.connect(url)//ket noi mongodb
    let dbo = server.db("ATNToys")//ket noi vs database atntoys
    await dbo.collection("Toys").insertOne(Toy)//day len database (insert thi hong can let result)
    res.redirect('/')

})

// khi nao can lay du lieu ms can toArray
//dung redirect thi truyen app.get con render thi truyen ten file
// app.post('/search', async (req,res)=>{
//     let search = req.body.search
//     let server = await MongoClient.connect(url)//ket noi mongodb
//     let dbo = server.db("ATNToys")//ket noi vs database atntoys
//     let result = await dbo.collection("Toys").find({'name':search}).toArray() //lay tu database 
//     res.render('/', {'result': result})
// })
app.post('/checkSearch', async (req,res)=>{
    let keyword = req.body.key
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let result = await dbo.collection("Toys").find({ 'name': new RegExp(keyword, 'i') }).toArray()
    res.render('home', {'result': result})
})


// app.post('/register', async (req, res) => {
//     let name = req.body.txtNamev
//     req.session.userName = name
//     //kiem trang trong database
//     let server = await MonggoClient.connect(url)
//     let dbo = server.db("ATNToys")
//     let result = await dbo.collection("users").find({ 'name': name })
//     if (result) {
//         res.render('profile', { 'name': req.session.userName })
//     } else {
//         res.write('khong hop le')
//         res.end()
//     }
// })

// app.get('/profile', isAuthenticated, (req, res) => {
//     let chuaDangNhap = !req.session.userName
//     res.render('profile', { 'name': req.session.userName, 'kiemTra': chuaDangNhap })
// })

// app.get('/', (req, res) => {
//     let accessCount = req.session.accessCount || 0
//     accessCount++
//     req.session.accessCount = accessCount
//     let chuaDangNhap = !req.session.userName

//     res.render('home', { 'accessCount': accessCount, 'chuaDangNhap': chuaDangNhap })
// })

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')

