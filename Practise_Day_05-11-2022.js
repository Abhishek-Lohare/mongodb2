// update members collection set status = 'Temporary ' for all members who belong to Pune (CI)
// /pune/ lower(city) like '%pune%'

db.LMS_MEMBERS.updateMany({ "CITY": /pune/i},{$set : {MEMBERSHIP_STATUS : "Permanent"}});
db.LMS_MEMBERS.updateMany({"CITY" : "Bogus"},{$set : {MEMBERSHIP_STATUS: "Not Defined"}},{upsert : true})    


// update book details and set edition number = 10 for all books with python category
db.LMS_BOOK_DETAILS.updateMany({"CATEGORY": /python/i},{$set: {BOOK_EDITION: 10 }})

// update book details and set edition number = 15 and price 10,000 for all books with python category
// update lms_book_details set edition = 15 , price = 10000 where category   = 'python';
db.LMS_BOOK_DETAILS.updateMany({"CATEGORY": /python/i},{$set: {"BOOK_EDITION": NumberInt(15),"PRICE": NumberInt(10000)}});

// select * from customer where address like '%pune%'
db.LMS_MEMBERS.find({"CITY" : /pune/i})

// select * from customer where street_no = 123
db.customer.find({"billing_address.street_no": NumberInt(123)},{})

// select * from  customer.Cart.added_products[] where [].product_id = 'X001' // invalid syntax just for reference
//Method 1:---->
db.getCollection("customer").aggregate(
    [
        {
            "$unwind" : {
                "path" : "$Cart.added_products"
            }
        }, 
        {
            "$match" : {
                "Cart.added_products.product_id" : "X001"
            }
        }
    ],
); //=============OR Can be solved using another method=============================
//Method 2: --->
db.customer.find({"Cart.added_products" : {$elemMatch: {"product_id" : "X001" }}}, {})
//================================================================================================
// select * from  customer.Cart.added_products[] where [].product_id = 'X003' // invalid syntax just for reference
db.getCollection("customer").aggregate(
    [
        {
            "$unwind" : {
                "path" : "$Cart.added_products"
            }
        }, 
        {
            "$match" : {
                "Cart.added_products.product_id" : "X003"
            }
        }
    ], 
    {
        "allowDiskUse" : false
    }
);
//=========================Method 2====================================================
db.customer.find({"Cart.added_products": {$elemMatch:{"product_id" : "X003"}}})
//=====================================================================================

// select * from customer where total_cost > 350
db.customer.find({"Cart.total_cost": {$gt: 350}})

//========================================================================================

// select * from customer where total_cost > 350 and address = 'Pune'
db.customer.find({$and: [{"Cart.total_cost": {$gt : 350}},{"address" : "Pune"}]})
db.customer.find({"Cart.total_cost": {$gt : 350},"address": "Pune"})
//=======================================================================================

// select * from customer where address in ('Pune','Chennai')
db.customer.find({"address" : {$in: ["Pune", "Chennai"]}})

//========================================================================================

// select * from customer where address != 'Chennai'
db.customer.find({address: {$ne : "Chennai"}})

//=========================================================================================

// select * from customer where address != 'chennai' // not so useful use case of toLowerCase()
db.customer.find({address: {$ne: "Chennai".toLowerCase()}})

//=========================================================================================

// Name of the supplier , contact , email , Address 
// who resides in either Mumbai Or Delhi [CI] and email does not belong to gmail account
db.LMS_SUPPLIERS_DETAILS.find({ADDRESS: {$in: [/mumbai/i , /delhi/i]}, EMAIL: {$not: /.*gmail*/ }},{_id:0,SUPPLIER_NAME:1,CONTACT:1,EMAIL:1,ADDRESS:1}) 

//========================================================================================================
//book_name,book_publication
// of all books placed on rack_num = a1 and publication is not equal to tata mcgraw hill
db.LMS_BOOK_DETAILS.find({"RACK_NUM" : "A1", PUBLICATION : {$ne: "Tata Mcgraw Hill"}}, {BOOK_TITLE:1,PUBLICATION:1})

//==================================================================================================

// book_code , member_id of all book issuances which have been fined 
db.LMS_BOOK_ISSUE.find({FINE_RANGE: {$ne: null}},{BOOK_CODE:1,MEMBER_ID:1})

//==============================================================================

// book_name and publication whose has atleast one supplier from chennai (CI)
db.EMBEDDED_JSON.find({BOOKS_SUPPLIED : {$elemMatch : {"ADDRESS" : "CHENNAI"}}},{_id:0,BOOK_TITLE:1, PUBLICATION:1})