const express=require('express');
const bodyParser=require('body-parser');
const request=require('request');
const https=require('https');
const app=express();

// All of the images and css files need to go in this public folder and the address which we need to mention for the image or css file has to be wrt public folder

// Enabling the server to use express and bosy-parser
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
 
// Getting the index file
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

// Sending the data to api
app.post("/",function(req,res){

    // Getting data from body-parser
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;

    // Creating the data based on API Refrence
    const data={
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{

                    // Merge Tags set in the mailchimp API can be changed in the API
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };

    // Turning the Javascript object into platpack JSON
    const jsonData=JSON.stringify(data);

    // url from the mailchimp endpopint with the list ID
    const url="https://us5.api.mailchimp.com/3.0/lists/95058b43ab"

    const options={
        method:"POST", // Type of request can be GET or POST or more in DOCS of HTTPS
        auth:"chirag8011:d41e9276d7600fa03b5a071f796a810f-us5"
    }
    const request=https.request(url,options,function(response){
        // Checking the data which was sent to us from mailchimp
        // Not necessary for the operation
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Sctive on port 3000 : http://localhost:3000/");
});

// API Key : d41e9276d7600fa03b5a071f796a810f-us5
// List ID : 95058b43ab