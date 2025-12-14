// routes/routes.go
package routes

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/Zexono/JoEarth_TaskManager/internal/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func StartServer(conn *pgx.Conn) {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "This is a test message from the backend"})
	})

	
	cfg := apiCfg{
		db: database.New(conn),
	}
	r.GET("/test2",cfg.testMsg)
	r.GET("/test3",cfg.testGetuser)
	r.POST("/test4",cfg.testAdduser)
	r.Run(":8080")
}

type apiCfg struct{
	db 	*database.Queries	 
	//platform string
	//secret 	 string
	//apikey   string
}

type user_json struct{
	ID        pgtype.UUID `json:"id"`
	CreatedAt pgtype.Timestamp `json:"created_at"`
	UpdatedAt pgtype.Timestamp `json:"updated_at"`
	Email     string    `json:"email"`
	Name	  string	`json:"name"`
}


func (cfg *apiCfg) testMsg (c *gin.Context){
	c.JSON(200, gin.H{"message": "This is a test message from the backend"})
}

func (cfg *apiCfg) testGetuser (c *gin.Context){

	user_db,err:= cfg.db.GetAllUser(context.Background())
	if err != nil {
		respondWithError(c.Writer,500,"can't get user database",err)
		return
	}
	var user []user_json
	for _, user_val := range user_db {
		user = append(user, user_json{
			ID: user_val.ID,
			CreatedAt: user_val.CreatedAt,
			UpdatedAt: user_val.UpdatedAt,
			Email: user_val.Email,
			Name: user_val.Name,
		})
	}

	respondWithJSON(c.Writer,http.StatusOK,user)



	//c.JSON(200, gin.H{"message": "This is a test message from the backend"})
}

func (cfg *apiCfg) testAdduser (c *gin.Context){

	user_db,err:= cfg.db.CreateUser(context.Background(),database.CreateUserParams{
		Email: "email1",
		Name: "user1",
		HashedPassword: "12345",
	})
	if err != nil {
		respondWithError(c.Writer,500,"can't add user database",err)
		return
	}

	user := user_json{
			ID: user_db.ID,
			CreatedAt: user_db.CreatedAt,
			UpdatedAt: user_db.UpdatedAt,
			Email: user_db.Email,
			Name: user_db.Name,
	}

	respondWithJSON(c.Writer,http.StatusOK,user)

}



func respondWithError(w http.ResponseWriter, code int, msg string, err error) {
	if err != nil {
		log.Println(err)
	}
	if code > 499 {
		log.Printf("Responding with 5XX error: %s", msg)
	}
	type errorResponse struct {
		Error string `json:"error"`
	}
	respondWithJSON(w, code, errorResponse{
		Error: msg,
	})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	dat, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %s", err)
		w.WriteHeader(500)
		return
	}
	w.WriteHeader(code)
	w.Write(dat)
}
