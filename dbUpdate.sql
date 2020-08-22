ALTER TABLE lib.library
DROP COLUMN rating,
DROP COLUMN genre,
DROP COLUMN length,
DROP COLUMN author,
DROP COLUMN user_id;

--isbn will also be used to store IMDB IDs
ALTER TABLE lib.library
ADD COLUMN author VARCHAR,
ADD COLUMN isbn VARCHAR;

--update column type of author in lib.library
ALTER TABLE lib.library
ALTER COLUMN author TYPE VARCHAR;

CREATE TABLE lib.lookup(
  user_id INT NOT NULL REFERENCES lib.user(id),
  item_id INT NOT NULL REFERENCES lib.library(id),
  qty INT 
);


DROP TABLE lib.rating;

DROP TABLE lib.genre;

DROP TABLE lib.author;

INSERT INTO lib.lookup (user_id, item_id, qty)
VALUES (8, 1, 1), (8, 2, 2)
;