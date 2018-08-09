create table users
(
	USER_ID INTEGER
		primary key,
	EMAIL TEXT not null
		unique,
	PASSWORD TEXT not null
)
;

create table data
(
	USER_ID INTEGER not null
		references users
			on update cascade on delete cascade,
	MILES REAL not null,
	GAS REAL not null,
	PRICE_PER_GAL REAL not null
)
;

