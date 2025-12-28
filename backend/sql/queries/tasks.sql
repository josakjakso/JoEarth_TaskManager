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

-- name: GetAllTasks :many
SELECT tasks.* , users.name FROM tasks  JOIN users ON tasks.assigned_to = users.id;

-- name: GetAllTasksUserCreate :many
SELECT tasks.* , users.name FROM tasks  JOIN users ON tasks.created_by = users.id
WHERE created_by = $1;

-- name: GetAllTasksAssignToUser :many
SELECT tasks.* , users.name FROM tasks  JOIN users ON tasks.assigned_to = users.id
WHERE assigned_to = $1;

-- name: DeleteTaskByID :exec
DELETE FROM tasks
WHERE id = $1 AND created_by = $2;