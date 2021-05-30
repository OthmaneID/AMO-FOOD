//Imports
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
var nodemailer = require('nodemailer');
const fs = require('fs');
const geolib = require('geolib')
const app = express();
const PORT = process.env.PORT || 3000


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        const IMGNAME = Date.now() + '-' + file.fieldname + file.mimetype.replace("/", '.');
        cb(null, IMGNAME);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

const db = require('./db');
const Livreurs = "Livreurs";
const Admins = "Admins";
const Foods = "Produits";
const Commands = "Commands";
var cookieParser = require("cookie-parser");
const { Console } = require('console');
const { ObjectId } = require('bson');



//Static Files  CSS Images JS

app.use(express.static('public'))
app.use('/CSS', express.static(__dirname + 'public/CSS'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use('/JS', express.static(__dirname + 'public/JS'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser());





//set Views
app.set('views', './views')
app.set('view engine', 'ejs')





db.connect((err) => {
    if (err) {
        console.log('Unable to Connect to database !');
        process.exit(1);
    } else {
        app.listen(PORT, () => {
            console.log("Connected to database , app listening on port !" + PORT)
        });
    }
});

//Rendering Home Page
app.get('', (req, res) => {
    res.render('home');
})

//Rendering Food Page
// Displaying the products 
app.get('/food', (req, res) => {
    res.clearCookie("Command", { httpOnly: true })
    db.getDB().collection(Foods).find({}).toArray((err, foods) => {
        if (err) {
            console.log(err)
        }
        else {

            res.render('food', { Foods: foods });
            // console.log(user)
        }
    })
})

//Rendering Admin Page



//Must be protected
app.get('/Admin', (req, res, next) => {

    const username = req.cookies["UserName"];

    if (username != null) {
        db.getDB().collection(Livreurs).find({}).toArray((err, documents) => {
            if (err) {
                console.log(err);
            }
            else {
                // console.log(documents);
                db.getDB().collection(Admins).findOne({ UserName: username }, function (err, user) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        db.getDB().collection(Foods).find({}).toArray((err, foods) => {

                            if (err) {
                                console.log(err)
                            }
                            else {

                                db.getDB().collection(Commands).find({}).toArray((err, commands) => {
                                    if (err) {
                                        console.log("Commands ERR : ", err)
                                    }
                                    else {
                                        res.render('Admin', { info: documents, Admin: user, Foods: foods, Commands: commands });
                                        // console.log(user)
                                    }
                                })

                            }

                        })
                    }
                })
            }
        })
    }
    else {
        res.redirect('/login');
    }
});
//Post Admin Page


app.post('/Admin', upload.single('IMAGE'), (req, res) => {
    console.log(req.file)

    if (req.file != null) {
        var ImagePath = ".." + req.file.path.replace(/\\/g, "/").substring("public".length)
    }
    else {
        var ImagePath = "/images/AMOFOOD_LOGO.png";
    }
    respo = {
        CIN: req.body.CIN,
        Nom: req.body.Nom,
        Prenom: req.body.Prenom,
        Email: req.body.Email,
        MotDP: req.body.Password,
        Profil: ImagePath,
        state: "indisponible",
        Phone: req.body.Phone,
        Commande_Livrer: 0,
        Location: {
            latitude: "1111",
            longitude: "1111"
        },
        Command_Gest: {

        }
    }
    db.getDB().collection(Livreurs).insertOne(respo, function (err, doc) {
        if (err) {
            return Console.log('Error in the livreur insert function !' + err);
        }
        else {
            // console.log(doc);
            return res.redirect('Admin')
        }
    });
})


//Rendering Login Page For Admin
app.get('/Login', (req, res) => {
    res.render('Admin-Log', { erreur: "" })
});

app.post('/Login', async (req, res, next) => {
    resp = {
        UserName: req.body.UserName,
        Password: req.body.password
    }
    //Checking if the UserName and the Password is correct
    let USR = await db.getDB().collection(Admins).findOne({ UserName: resp.UserName, Password: resp.Password });
    if (USR != null) {

        res.cookie("UserName", USR.UserName, { httpOnly: true })
        console.log('the user \'' + USR.UserName + '\' is Connected');
        res.redirect("Admin");

    }
    else {
        console.log("info wrong !")
        res.render('Admin-log', { erreur: "Email or/And Password is incorrect" })
    }
    res.status(200).end();
})

app.post('/logout', (req, res) => {
    res.clearCookie("UserName", { httpOnly: true });
    res.redirect("login")
});

//get the (livreur) Details Page
app.get('/Admin/Livreur/:id', async (req, res) => {
    if (req.cookies["UserName"] != null) {
        let livId = req.params.id;
        try {
            const account = await db.getDB().collection(Livreurs).findOne(ObjectId(livId));
            if (account != null) {
                account.Profil = (account.Profil).replace('../', '/');
                console.log("Livreur : ", account)
                res.render("Livreur_review", { Account: account });
            }

        } catch (err) {
            res.send("Failed to Find the Account!");
        }
    }
    else {
        res.redirect('/../login');
    }
});


app.get('/Support', (req, res) => {
    res.render('Send_Email');
});

app.post('/SendMail', (req, res) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'amofood.contact@gmail.com',
            pass: 'amofood1234'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: 'amofood.contact@gmail.com',
        to: 'amofood@outlook.com',
        subject: 'AMOFOOD SUPPORT FROM : ' + req.body.UserName,
        text: req.body.Message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.redirect('/Support');
})


// POST FOOD COMMAND
app.post('/Command_info', (req, res, next) => {

    console.log("POST DATA IN FOOD PAGE !");
    var commandInfo = req.body;
    console.log(commandInfo);
    var tot = 0;
    for (var i = 0; i < commandInfo.length; i++) {
        tot += parseInt(commandInfo[i].price * commandInfo[i].Qtt)
    }
    tot += 10
    var JsonCMD = JSON.stringify({ Command: commandInfo, Total: tot });
    console.log("json var ", JSON.parse(JsonCMD))
    res.cookie("Command", JsonCMD, { httpOnly: true })
    console.log(req.cookies["Command"])
    res.redirect('/Command_Info')
});

app.get('/Command_Info', (req, res) => {
    var command = req.cookies["Command"];

    if (command != null) {
        command = JSON.parse(command)
        console.log('Cookies : ', command)
        console.log("Cookie Is: ", command.Command);
        console.log('Get Command')
        res.render("Command_Info", { command: command.Command, Total: command.Total });
    }
    else {
        res.redirect('/food');
    }
    // res.end()
});

// Create Food  Element
app.post('/Create_Food', upload.single('FOOD-IMG'), (req, res) => {

    console.log('Image Path: ', req.file.path)
    food = {
        Name: req.body.Name,
        Categorie: req.body.Categorie,
        Descritption: req.body.Desc,
        Price: req.body.Price,
        Image: req.file.path.replace(/\\/g, "/").substring("public".length),
    }
    console.log("food : ", food)
    db.getDB().collection(Foods).insertOne(food, function (err, resu) {
        if (err) {
            console.log(err)
        }
        else {
            console.log('Element inserted ! ', resu.insertedCount, resu.insertedId);
            res.redirect('Admin')
        }
    })
})

// Delete food
app.post('/delete_food', (req, res) => {
    console.log('ID of deleted element :', req.body.id)
    db.getDB().collection(Foods).findOne({ _id: ObjectId(req.body.id) }, (err, resu) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Profil : ", resu.Image);
            var Image_Path = resu.Image;
        }

        Image_Path = "public/" + Image_Path
        fs.unlink(Image_Path, function (err, cb) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(cb)
            }
        })
        db.getDB().collection(Foods).deleteOne({ _id: ObjectId(req.body.id) }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result.deletedCount)
            }
        })
    })
})

app.post('/delete_Liv', (req, res) => {

    console.log('ID of deleted element :', req.body.id)

    db.getDB().collection(Livreurs).findOne({ _id: ObjectId(req.body.id) }, (err, resu) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Profil : ", resu.Profil);
            var Image_Path = resu.Profil;
        }
        if (Image_Path.replace('/images/', '') != "AMOFOOD_LOGO.png") {
            Image_Path = "public/" + Image_Path.replace('..', '')

            fs.unlink(Image_Path, function (err, cb) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(cb)
                }
            })
        }
        db.getDB().collection(Livreurs).deleteOne({ _id: ObjectId(req.body.id) }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result.deletedCount)
                res.redirect('Admin');
            }
        })
    })

})




// Send Command 
app.post('/Commander', (req, res) => {
    var command = req.cookies["Command"];
    command = JSON.parse(command);
    command = command.Command;
    var Info = req.body;
    console.log("command->", command)
    console.log('Info : ', Info)

    CommandDB = {
        UserName: Info.UserName,
        Email: Info.Email,
        Phone: Info.Phone,
        command: command,
        Stat: "Confirming",
        Location: Info.Location,
        Adresse: Info.Adresse
    }
    // Getting the distance between the client position and the delivery guy pos
    db.getDB().collection(Livreurs).find({}).toArray((err, livrs) => {
        if (err) {
            console.error(err)
        }
        else {
            //  console.log(livrs)
            console.log('Livreurs ', livrs)
            let livrs_pos = [];
            for (var i = 0; i < livrs.length; i++) {
                livrs_pos.push(livrs[i].Location);
            }
            console.log("LIVRS POS", livrs_pos)
            console.log("COMMAND POS", CommandDB.Location)
            var Nearest = geolib.findNearest(CommandDB.Location, livrs_pos);
            console.log("the closest One Is :", Nearest)
            // Insert the Command
            db.getDB().collection(Commands).insertOne(CommandDB, (err, resu) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log('Element inserted ! ', resu.insertedCount, resu.insertedId);

                    var Command_Gest;
                    if (livrs.Command_Gest == null) {
                        Command_Gest = []
                    }
                    else {
                        Command_Gest = livrs.Command_Gest;
                    }
                    var id = resu.insertedId

                    console.log("Command_Gest : ", Command_Gest)
                    Command_Gest.push({ Command_ID: id })
                    db.getDB().collection(Livreurs).updateOne({ Location: Nearest }, { $set: { Command_Gest: Command_Gest } }, (err, liv_mod) => {
                        if (err) {
                            console.error(err)
                        }
                        else {
                            console.log('GestCom inserted ', liv_mod.modifiedCount)
                        }
                    })
                }
            })
            console.log("CommandDB : ", CommandDB)

        }
    })
    // 

})




// Edit Prod
app.get('/Admin/Command_Edit/:id', async (req, res) => {

    if (req.cookies["UserName"] != null) {
        console.log("Get Command_Edit")
        let CommandId = req.params.id;
        res.cookie('PROD_ID', CommandId)
        try {
            const Produit = await db.getDB().collection(Foods).findOne(ObjectId(CommandId));
            if (Produit != null) {
                console.log(Produit)
                res.render("Edit_Prod", { Prod: Produit });
            }
        } catch (err) {
            res.send(err);
        }
    }
    else {
        res.redirect('/../login');
    }
});

// Update Food Infos , deleting the old image and adding the new image

// HELLOOOO CHANGES
app.post('/Food_Edit', upload.single('Image_Update'), (req, res) => {


    var Edited_Id = req.cookies['PROD_ID']
    console.log('Edited Id is : ', Edited_Id);

    db.getDB().collection(Foods).findOne(ObjectId(Edited_Id), (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            var Image_Path = doc.Image;
            // Updating Infos
            if (req.file != null) {
                //  Deleting Old IMG
                Image_Path = "public/" + Image_Path.replace('..', '')
                fs.unlink(Image_Path, function (err, cb) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("Image Deleted :", cb)
                    }
                })
                Image_Path = req.file.path.replace(/\\/g, "/").substring("public".length);

            }
            var NewFood = {
                Name: req.body.Name,
                Categorie: req.body.Categorie,
                Descritption: req.body.Description,
                Price: req.body.Price,
                Image: Image_Path.replace('public/', ''),
            }
            console.log("INFOS : ", NewFood)

            db.getDB().collection(Foods).updateOne({ _id: ObjectId(Edited_Id) }, { $set: NewFood }, (err, result) => {
                if (err) {
                    console.log("Erreur : ", err)
                }
                else {
                    console.log('FOOD EDITED : ', result.modifiedCount);
                    res.redirect(req.get('referer'));
                }
            })
        }

    })
});