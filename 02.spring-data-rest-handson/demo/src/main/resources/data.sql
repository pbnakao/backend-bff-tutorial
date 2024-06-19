insert into Company values ('com001','会社01');
insert into Company values ('com002','会社02');
insert into Company values ('com003','会社03');

insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,EMAIL,AGE) values ('com001','u001','木野1','kino1@example.com',48);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,EMAIL,AGE) values ('com001','u002','木野2','kino2@example.com',47);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,AGE) values ('com001','u003','木野3',15);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,AGE) values ('com002','u004','佐藤1',16);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,AGE) values ('com002','u005','佐藤2',17);
insert into App_User (COMPANY_CODE,USER_ID,LAST_NAME,AGE) values ('com003','u006','佐藤3',18);