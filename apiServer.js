const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
// These lines will be explained in detail later in the unit

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://giftadmin:admin@cluster0.kntxnvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Global for general use
var userCollection;
var orderCollection;

client.connect(err => {
   userCollection = client.db("giftdelivery").collection("users");
   orderCollection = client.db("giftdelivery").collection("orders");
   
  // perform actions on the collection object
  console.log ('Database up!\n')
 
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


 
app.get('/getUserDataTest', (req, res) => {

	userCollection.find({}, {projection:{_id:0}}).toArray( function(err,docs) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
		   console.log( JSON.stringify(docs) + " have been retrieved.\n");
		   var str = "<h1>" + JSON.stringify(docs) + "</h1>"
		   str+= "<h1> Error: " +  err +  "</h1>"
		   res.send(str); 
		}

	});

});

app.get('/getOrderDataTest', (req, res) => {

	orderCollection.find({},{projection:{_id:0}}).toArray( function(err,docs) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
		   console.log( JSON.stringify(docs) + " have been retrieved.\n");
		   var str = "<h1>" + JSON.stringify(docs) + "</h1>"
		   str+= "<h1> Error: " +  err +  "</h1>"
		   res.send(str); 
		}

	});

});


app.post('/verifyUser', (req, res) => {

	loginData = req.body;
	console.log(loginData);

	userCollection.find({email:loginData.email, password:loginData.password}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
		    console.log(JSON.stringify(docs) + " have been retrieved.\n");
		   	res.status(200).send(docs);
		}	   
		
	  });

});

app.get('/getOrderData', (req, res) => {

	userData =  req.query;
	console.log("GET request received : " + JSON.stringify(userData));
	orderCollection.find({customerEmail:userData.email}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
		   console.log( JSON.stringify(docs) + " have been retrieved.\n");
		   res.json(docs);
		}	   
		
	  });
});

app.post('/postOrderData', function (req, res) {
    
    console.log("POST request received : " + JSON.stringify(req.body)); 
    
    orderCollection.insertOne(req.body, function(err, result) {
	       if (err) {
				console.log("Some error.. " + err + "\n");
	       }else {
			    console.log(JSON.stringify(req.body) + " have been uploaded\n"); 
		    	res.send(JSON.stringify(req.body));
		 }
		
	});       

});

// Checking if the user already exists in the database
app.post('/postUserData', function (req, res) {
	
	console.log("POST request received : " + JSON.stringify(req.body)); 
	
	userCollection.find({email:req.body.email}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
			if (docs.length > 0) {
				console.log("User already exists\n");
				res.send("User already exists");
			} else {
				userCollection.insertOne(req.body, function(err, result) {
				   if (err) {
						console.log("Some error.. " + err + "\n");
				   }else {
						console.log(JSON.stringify(req.body) + " have been uploaded\n"); 
						res.send(JSON.stringify(req.body));
				   }
				});
			}
		}
	});
});

// delete orders by logged user
app.delete('/deleteOrderData', function (req, res) {
	
	userData =  req.body;
	console.log("Delete request received : " + JSON.stringify(userData)); 
	orderCollection.deleteMany({customerEmail:userData.email}, function(err, result) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
			console.log(result.deletedCount + " orders deleted\n");
			res.send(result.deletedCount + " orders deleted\n");
		}
	});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
});


