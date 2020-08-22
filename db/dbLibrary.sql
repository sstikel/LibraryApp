CREATE SCHEMA lib;

CREATE TABLE lib.user (
  id serial PRIMARY KEY,
  name_first varchar(25) NOT NULL,
  name_last varchar(25) NOT NULL,
  username varchar(25) NOT NULL, 
  h_password varchar(255) NOT NULL
); --created

CREATE TABLE lib.format (
  id serial PRIMARY KEY,
  format varchar(25)
);

CREATE TABLE lib.rating (
  id serial PRIMARY KEY,
  rating varchar(25)
);

CREATE TABLE lib.genre (
  id serial PRIMARY KEY,
  genre varchar(25)
);

CREATE TABLE lib.author (
  id serial PRIMARY KEY,
  name_first varchar(25)  NOT NULL,
  name_last varchar(25) NOT NULL,
  name_middle varchar(25),
  other varchar(100)
);

CREATE TABLE lib.library (
  id        serial        PRIMARY KEY,
  title     varchar(50)  NOT NULL,
  sub_title varchar(100),
  author    int          REFERENCES lib.author (id),
  year      int,
  rating    int          REFERENCES lib.rating (id),
  genre     int          REFERENCES lib.genre (id),
  format    int          REFERENCES lib.format (id),
  length    varchar(30)
);
--Will need to include user info for recall...

INSERT INTO lib.format (format)
  VALUES ('book'), ('dvd'), ('cd'), ('br')
  ;
  
INSERT INTO lib.rating (rating)
  VALUES ('G'), ('PG'), ('PG-13'), ('R'), ('NR'), ('YOUTH'), ('TEEN'), ('ADULT')
  ;
  
INSERT INTO lib.genre (genre)
  VALUES ('Action'), ('Comedy'), ('Romance'), ('Fantasy')
  ;

  INSERT INTO lib.author (name_first, name_last)
  VALUES ('Tom', 'Clancy'), ('John', 'Grisham'), ('John', 'McTiernan')
  ;

  INSERT INTO lib.library (title, author, year, rating, genre, format, length)
  VALUES 
  ('Threat Vector', 1, 2013, 8, 1, 1, '608 pgs'),
  ('Braveheart', 4, 1995, 4, 1, 2, '3h 2m')
  ;

 