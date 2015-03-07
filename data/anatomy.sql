DROP TABLE IF EXISTS anatomy;
CREATE TABLE anatomy (
    node_id     INT,
    names       TEXT[],
    children    INT[],
    keywords    TEXT[]
);

