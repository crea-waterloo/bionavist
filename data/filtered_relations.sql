DROP TABLE IF EXISTS filtered_relations;
CREATE TABLE filtered_relations (
    subject     VARCHAR NOT NULL,
    predicate   VARCHAR NOT NULL,
    object      VARCHAR NOT NULL,
    keyword     INT,
    link        VARCHAR
);

