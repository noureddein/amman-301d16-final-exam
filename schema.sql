DROP TABLE IF EXISTS book_wiki;

CREATE TABLE book_wiki(
    id SERIAL PRIMARY KEY NOT NULL,
    quote VARCHAR NOT NULL,
    character VARCHAR NOT NULL,
    image VARCHAR NOT NULL,
   characterdirection VARCHAR NOT NULL
)