package main

import (
	"context"
	"log"
	"os"

	"github.com/Zexono/JoEarth_TaskManager/routes"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatalf("can't load .env %v", err)
	// }

	godotenv.Load()
	// conn, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	// if err != nil {
	// 	log.Fatalf("Failed to connect to the database: %v", err)
	// }
	// defer conn.Close()

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is not set in environment variables")
	}

	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		log.Fatalf("Unable to parse DATABASE_URL: %v", err)

	}
	config.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	conn, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer conn.Close()

	var version string
	if err := conn.QueryRow(context.Background(), "SELECT version()").Scan(&version); err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	log.Println("Connected to:", version)

	routes.StartServer(conn)

}
