db.createCollection("my_first_field");
show collections;

db.createCollection("my_first_collection");

db.createCollection("my_first_collection")
show collections;
db.deleteCollection("my_first_field");
db.my_first_field.drop();
db.my_first_collection.insertOne({"my_first_field" : "ONE"});
db.my_first_collection.find();
db.my_first_collection.insertOne({"_id" : "TWO", "my_first_field" : "ONE"});
db.my_first_collection.deleteMany({"my_first_field" : "ONE"})
db.my_first_collection.updateOne({"_id" : "ONE"}, { $set:{field : "yzzzzu" }})
//db.my_first_collectIon.updateOne({},{$set : {my_third_field : "Updated" } })
db.my_first_collection.updateOne({"_id" : "ONE"}, { $pull:{field : "yzzzzu" }})

db.my_first_collection.insertOne(  { "my_first_field" : "TWO" }   );
db.my_first_collection.insertOne(  { "my_second_field" : "SECOND" }   );
db.my_first_collection.insertOne( {
                                    	"my_first_field": "ONE",
                                    	"my_second_field": "SECOND"
                                   }
                                 );

db.my_first_collection.insertOne( {
                                    	"my_third_field": "vedant",
                                    	"my_fourth_field": "kulkarni"
                                   }
                                 );

db.my_first_collection.insertMany(
[
	{
											"my_third_field": "Vaffffffi",
											"my_fourth_field": "bhav",
											"my_first_field": "ONE",
                                    	    "my_second_field": "SECOND"
											
											
	},
	{
											"my_third_field": "fffff",
											"my_fourth_field": "lohare",
											"my_first_field": "ONE",
                                    	"my_second_field": "SECOND"
	},
	{
											"my_third_field": "sumeffffffet",
											"my_fourth_field": "l",
											"my_first_field": "ONE",
                                    	"my_second_field": "SECOND"
	}
]
);


//////db.my_first_collection.find();



db.my_first_collection.find();
db.my_first_collection.insertOne( {
                                    	"_id":"635bc5473cf8581e6c62d979",
                                    	"my_third_field": "THIRD",
                                    	"my_fourth_field": "FOURTH"
                                   }
                                 ); 

db.getCollection("my_first_collection").deleteOne({"_id":"ONE"});
db.my_first_collection.deleteMany({"my_second_field":"SECOND"});

db.my_first_collection.updateOne({},{$set : {my_third_field : "Updated" } })
db.my_first_collection.updateMany({},{$set : {my_fourth_field : "Updated_again" } })
db.my_first_collection.updateMany({},{$set : {my_fifth_field : "Updated_here_again" } }) 



