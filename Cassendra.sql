/*
----------------
Create a table lms_book_details_by_publication_category 
with (PUBLICATION,CATEGORY) as partition key and book_code as clustering key 
and other columns BOOK_TITLE,AUTHOR,PUBLISH_DATE,PRICE,RACK_NUM,DATE_ARRIVAL
BOOK_EDITIONS is a list of all possible book editions that book can have  [2 marks]

Insert some random 6 records to the table
write following queries : 

a) add to the existing list book edition int = -9999
b) select all books where publication is 'Tata Mcgraw Hill' and category is 'Java' 
c) Add a new column to the table named "my_comments"  of datatype text
d) Update concatenated string <name of the book> and <publication> 
	where publication is 'Tata Mcgraw Hill' and category is 'Java'*/
=============================================================================================


create table lms_book_details_by_publication_category(
	PUBLICATION varchar,
	CATEGORY varchar,
	book_code int,
	book_title varchar,
	publish_date varchar,
	price int,
	book_edition list<text>,
	RACK_NUM int,
	DATE_ARRIVAL date,
	primary key((PUBLICATION, CATEGORY), book_code)
);

insert into lms_book_details_by_publication_category (PUBLICATION, CATEGORY, book_code, book_title, publish_date, price, book_edition, RACK_NUM, DATE_ARRIVAL) 
values ('Tata Mcgraw Hill', 'Java', 1, 'Java Book', '1999-06-16', 500,['600'], 1, '2022-01-01');

insert into lms_book_details_by_publication_category (PUBLICATION, CATEGORY, book_code, book_title, publish_date, price, book_edition, RACK_NUM, DATE_ARRIVAL) 
values ('Penguine', 'python', 1, 'Py champ', '1998-07-20', 1000,['800'], 1, '2022-02-01');

insert into lms_book_details_by_publication_category (PUBLICATION, CATEGORY, book_code, book_title, publish_date, price, book_edition, RACK_NUM, DATE_ARRIVAL) 
values ('V.K.Mehta', 'Aptitude', 1, 'ABC aptitude', '2005-07-20', 500,['400'], 2, '2022-06-16');

insert into lms_book_details_by_publication_category (PUBLICATION, CATEGORY, book_code, book_title, publish_date, price, book_edition, RACK_NUM, DATE_ARRIVAL) 
values ('V.K', 'WOrld of cricket', 1, 'D.C', '2015-07-20', 250,['300'], 3, '2022-09-16');
alter table lms_book_details_by_publication_category add book_edition int;


update lms_book_details_by_publication_category set  book_edition = 9999  where(('V.K' ,'WOrld of cricket'), 1);

select * from lms_book_details_by_publication_category where PUBLICATION = 'Tata Mcgraw Hill' and CATEGORY = 'Java';

 /*Update BOOK_TITLE to "My_hardcoded_string"
	where publication is 'Tata Mcgraw Hill' and category is 'Java'
	for a particular book_code of your choice*/
 
 update lms_book_details_by_publication_category set BOOK_TITLE = 'My_hardcoded_string' where publication = 'Tata Mcgraw Hill' and category = 'Java' and book_code = 1; 