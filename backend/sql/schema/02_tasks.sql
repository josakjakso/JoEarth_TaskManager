-- +goose Up
CREATE TYPE progess_status AS ENUM ('To_do','In_Progess','Waiting','Done');
CREATE TYPE priority_status AS ENUM ('Low','Medium','High');

CREATE TABLE tasks(
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status progess_status NOT NULL DEFAULT 'To_do',
    priority priority_status NOT NULL DEFAULT 'Medium',
    assigned_to UUID NOT NULL REFERENCES users(id),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    start_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP
);

-- +goose Down
DROP TABLE tasks;