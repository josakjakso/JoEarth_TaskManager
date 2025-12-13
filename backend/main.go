package main

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5"
)

func main() {
    conn, err := pgx.Connect(context.Background(), "postgresql://postgres:JoEarth1212312121@db.uviikrjmyiuhtoqxsthx.supabase.co:5432/postgres")
    if err != nil {
        log.Fatalf("Failed to connect to the database: %v", err)
    }
    defer conn.Close(context.Background())

    // Example query to test connection
    var version string
    if err := conn.QueryRow(context.Background(), "SELECT version()").Scan(&version); err != nil {
        log.Fatalf("Query failed: %v", err)
    }

    log.Println("Connected to:", version)
}