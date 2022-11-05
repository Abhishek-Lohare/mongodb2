db.getCollection("LMS_BOOK_DETAILS").find({})
db.LMS_BOOK_DETAILS.find()
//select lms_members.* 
// from lms_members left join lms_book_issue 
// on (lms_members.member_id = lms_book_issue.member_id ) ;

db.getCollection("LMS_MEMBERS").aggregate(
    [
        {
            "$lookup" : {
                "from" : "LMS_BOOK_ISSUE",
                "localField" : "MEMBER_ID",
                "foreignField" : "MEMBER_ID",
                "as" : "output array of Book Issued Members"
            }
        }, 
        {
            "$unwind" : {
                "path" : "$output array of Book Issued Members"
            }
        }
    ],
);
//=======================================================================================
// all members who have issued a book
// using joins

db.getCollection("LMS_MEMBERS").aggregate(
    [
        {
            "$lookup" : {
                "from" : "LMS_BOOK_ISSUE",
                "localField" : "MEMBER_ID",
                "foreignField" : "MEMBER_ID",
                "as" : "Members who issued books"
            }
        }, 
        {
            "$unwind" : {
                "path" : "$Members who issued books"
            }
        }
    ],
);

//====================================================================================

//  name of the suppliers who reside in 'pune/mumbai/chennai'[CI]
// who have supplied a book placed on rack_numbers A1/A2/A3
// and their category is not JAVA 
/*
select lms_book_details.book_title
from lms_suppliers_details inner join lms_book_details on (lms_suppliers_details.supplier_id = lms_book_details.supplier_id )
where lower(lms_suppliers_details.address) in ('pune','mumbai','chennai')
and rack_num in ('A1','A2','A3')
and category != 'JAVA';
*/

db.getCollection("LMS_SUPPLIERS_DETAILS").aggregate(
    [
        {
            "$lookup" : {
                "from" : "LMS_BOOK_DETAILS",
                "localField" : "SUPPLIER_ID",
                "foreignField" : "SUPPLIER_ID",
                "as" : "Suppliers who issued books"
            }
        }, 
        {
            "$unwind" : {
                "path" : "$Suppliers who issued books"
            }
        }, 
        {
            "$match" : {
                "ADDRESS" : {
                    "$in" : [
                        /pune/i,
                        /mumbai/i,
                        /chennai/i
                    ]
                }
            }
        }, 
        {
            "$match" : {
                "Suppliers who issued books.RACK_NUM" : {
                    "$in" : [
                        "A1",
                        "A2",
                        "A3"
                    ]
                }
            }
        }, 
        {
            "$match" : {
                "Suppliers who issued books.CATEGORY" : {
                    "$ne" : "JAVA"
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 0.0,
                "BOOK_NAME" : "$Suppliers who issued books.BOOK_TITLE"
            }
        }
    ], 
);






//=======================================================================================
// name of the supplier , book_title , member_id 
// such that the supplier may or may not have supplied a book
// and the supplier book may or may not be issued to a member 
/*
LMS_SUPPLIER_DETAILS LEFT JOIN LMS_BOOK_DETAILS
ON(LMS_SUPPLIER_DETAILS.SUPPLIER_ID = LMS_BOOK_DETAILS.SUPPLIER_ID)
LEFT JOIN LMS_BOOK_ISSUE ON (LMS_BOOK_DETAILS.BOOK_CODE = LMS_BOOK_ISSUE.BOOK_CODE ) */

db.getCollection("LMS_SUPPLIERS_DETAILS").aggregate(
    [
        {
            "$lookup" : {
                "from" : "LMS_BOOK_DETAILS",
                "localField" : "SUPPLIER_ID",
                "foreignField" : "SUPPLIER_ID",
                "as" : "Suppliers"
            }
        }, 
        {
            "$unwind" : {
                "path" : "$Suppliers",
                "preserveNullAndEmptyArrays" : true
            }
        }, 
        {
            "$lookup" : {
                "from" : "LMS_BOOK_ISSUE",
                "localField" : "Suppliers.BOOK_CODE",
                "foreignField" : "BOOK_CODE",
                "as" : "Issuance_details"
            }
        }, 
        {
            "$unwind" : {
                "path" : "$Issuance_details",
                "preserveNullAndEmptyArrays" : true
            }
        }, 
        {
            "$project" : {
                "_id" : 0.0,
                "SUPPLIERS_NAME" : "$SUPPLIER_NAME",
                "Book_name" : "$Suppliers.BOOK_TITLE",
                "MEMBER_ID" : "$Issuance_details.MEMBER_ID"
            }
        }
    ],
);



// book_code and name of the book which has been issued more than 4 times and has more than 0 suppliers
// (Note: Java how to program has 2 book codes because of different published date)
/*
select lms_book_issue.BOOK_CODE,lms_book_details.BOOK_TITLE, count(*) from
lms_book_details INNER JOIN  lms_book_issue on (lms_book_issue.BOOK_CODE = lms_book_details.BOOK_CODE)
where lms_book_details.supplier_id is not null 
group by lms_book_issue.BOOK_CODE,lms_book_details.BOOK_TITLE
having count(book_issue_no) > 4 
*/

db.getCollection("LMS_BOOK_DETAILS").aggregate(
    [
        {
            "$lookup" : {
                "from" : "LMS_BOOK_ISSUE",
                "localField" : "BOOK_CODE",
                "foreignField" : "BOOK_CODE",
                "as" : "ISSUED_BOOK"
            }
        }, 
        {
            "$unwind" : {
                "path" : "$ISSUED_BOOK"
            }
        }, 
        {
            "$group" : {
                "_id" : {
                    "BOOK_CODE" : "$ISSUED_BOOK.BOOK_CODE",
                    "BOOK_TITLE" : "$BOOK_TITLE"
                },
                "cnt" : {
                    "$sum" : 1.0
                }
            }
        }, 
        {
            "$match" : {
                "cnt" : {
                    "$gt" : 4.0
                }
            }
        }, 
        {
            "$project" : {
                "BOOK_CODE" : 1.0,
                "BOOK_TITLE" : 1.0
            }
        }
    ], 
);

//===========================================================================================


/*
-- total number of books placed on given rack number
-- such that edition of the book is atleast 3
-- and it is supplied by a supplier who has a rediff / gmail account
-- and the book is issued to the students who are permanent in status
*/
db.getCollection("LMS_BOOK_DETAILS").aggregate(
    [
        {
            "$lookup" : {
                "from" : "LMS_SUPPLIERS_DETAILS",
                "localField" : "SUPPLIER_ID",
                "foreignField" : "SUPPLIER_ID",
                "as" : "BOOKS_With_SUPPLIERS"
            }
        },
        {
            "$unwind" : {
                "path" : "$BOOKS_With_SUPPLIERS"
            }
        },
        {
            "$match" : {
                "BOOK_EDITION" : {
                    "$gt" : 2.0
                },
                "BOOKS_With_SUPPLIERS.EMAIL" : {
                    "$in" : [
                        /.*gmail.com/,
                        /.*rediff.com/
                    ]
                }
            }
        },
        {
            "$lookup" : {
                "from" : "LMS_BOOK_ISSUE",
                "localField" : "BOOK_CODE",
                "foreignField" : "BOOK_CODE",
                "as" : "Issuance"
            }
        },
        {
            "$unwind" : {
                "path" : "$Issuance"
            }
        },
        {
            "$lookup" : {
                "from" : "LMS_MEMBERS",
                "localField" : "Issuance.MEMBER_ID",
                "foreignField" : "MEMBER_ID",
                "as" : "Members"
            }
        },
        {
            "$unwind" : {
                "path" : "$Members"
            }
        },
        {
            "$match" : {
                "Members.MEMBERSHIP_STATUS" : "Permanent"
            }
        },
        {
            "$group" : {
                "_id" : {
                    "RACK_NUM" : "$RACK_NUM",
                    "BOOK_CODE" : "$BOOK_CODE"
                }
            }
        },
        {
            "$group" : {
                "_id" : {
                    "RACK_NUM" : "$_id.RACK_NUM"
                },
                "cnt" : {
                    "$sum" : 1.0
                }
            }
        },
        {
            "$project" : {
                "RACK_NUM" : "$_id.RACK_NUM",
                "cnt" : 1.0,
                "_id" : 0.0
            }
        }
    ],
);