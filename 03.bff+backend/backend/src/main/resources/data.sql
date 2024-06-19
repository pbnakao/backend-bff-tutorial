insert into Company values ('com001','会社01');
insert into Company values ('com002','会社02');
insert into Company values ('com003','会社03');

insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,FIRST_NAME,email,age) values ('com001','u001','鈴木','太郎','suzuki-taro@example.com',48);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,FIRST_NAME,email,age) values ('com001','u002','鈴木','花子','suzuki-hanako@example.com',47);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,FIRST_NAME,age) values ('com001','u003','田中','太郎',15);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,FIRST_NAME,age) values ('com002','u004','佐藤1','太郎',16);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,FIRST_NAME,age) values ('com002','u005','佐藤2','花子',17);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,FIRST_NAME,age) values ('com003','u006','佐藤3','次郎',18);