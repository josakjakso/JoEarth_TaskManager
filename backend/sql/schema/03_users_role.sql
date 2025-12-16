-- +goose Up
CREATE TYPE roles AS ENUM ('minion','boss');

ALTER TABLE users
ADD COLUMN role roles NOT NULL 
DEFAULT 'minion';

-- +goose Down
ALTER TABLE users
DROP COLUMN role;