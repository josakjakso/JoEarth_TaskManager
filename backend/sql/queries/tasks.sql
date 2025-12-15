-- name: CreateTask :one
INSERT INTO
    tasks (
        id,
        title,
        description,
        status,
        priority,
        assigned_to,
        created_by,
        created_at,
        updated_at,
        start_date,
        due_date
    )
VALUES
    (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        NOW(),
        NOW(),
        $7,
        $8
    ) RETURNING *;