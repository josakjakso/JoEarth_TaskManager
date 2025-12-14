// routes/routes.go
package routes

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Zexono/JoEarth_TaskManager/internal/auth"
	"github.com/Zexono/JoEarth_TaskManager/internal/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/joho/godotenv"
)

func StartServer(conn *pgx.Conn) {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "This is a test message from the backend"})
	})

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("can't load .env %v", err)
	}

	cfg := apiCfg{
		db: database.New(conn),
		secret: os.Getenv("SECRET"),
	}
	r.GET("/test3", cfg.testGetuser)
	r.POST("/testAddUser", cfg.testAdduser)
	r.POST("/testlogin",cfg.testLogin)
	r.Run(":8080")
}

type apiCfg struct {
	db *database.Queries
	//platform string
	secret 	 string
	//apikey   string
}

type user_json struct {
	ID        uuid.UUID      `json:"id"`
	CreatedAt pgtype.Timestamp `json:"created_at"`
	UpdatedAt pgtype.Timestamp `json:"updated_at"`
	Email     string           `json:"email"`
	Name      string           `json:"name"`
}

func (cfg *apiCfg) testGetuser(c *gin.Context) {

	user_db, err := cfg.db.GetAllUser(context.Background())
	if err != nil {
		respondWithError(c.Writer, 500, "can't get user database", err)
		return
	}
	var user []user_json
	for _, user_val := range user_db {
		user = append(user, user_json{
			ID:        user_val.ID,
			CreatedAt: user_val.CreatedAt,
			UpdatedAt: user_val.UpdatedAt,
			Email:     user_val.Email,
			Name:      user_val.Name,
		})
	}

	respondWithJSON(c.Writer, http.StatusOK, user)

	//c.JSON(200, gin.H{"message": "This is a test message from the backend"})
}

func (cfg *apiCfg) testAdduser(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		respondWithError(c.Writer, 400, "invalid request payload", err)
		return
	}

	pass ,err := auth.HashPassword(req.Password)
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "password hash error", err)
		return
	}

	user_db, err := cfg.db.CreateUser(context.Background(), database.CreateUserParams{
		Email:          req.Email,
		Name:           req.Name,
		HashedPassword: pass,
	})
	if err != nil {
		respondWithError(c.Writer, 500, "can't add user database", err)
		return
	}

	user := user_json{
		ID:        user_db.ID,
		CreatedAt: user_db.CreatedAt,
		UpdatedAt: user_db.UpdatedAt,
		Email:     user_db.Email,
		Name:      user_db.Name,
	}

	respondWithJSON(c.Writer, http.StatusOK, user)

}

func (cfg *apiCfg) testLogin (c *gin.Context){
	type req struct {
		Email 	  string `json:"email"`
		Password  string `json:"password"`
		//ExpiresIn int `json:"expires_in_seconds"`
	}

	var params req

	type response struct {
		user_json
		Token        string `json:"token"`
		RefreshToken string `json:"refresh_token"`
	}

	if err := c.ShouldBindJSON(&params); err != nil {
		respondWithError(c.Writer, 400, "invalid request payload", err)
		return
	}

	user_db , err := cfg.db.GetUserByEmail(context.Background(),params.Email)
	if err != nil {
		respondWithError(c.Writer, http.StatusUnauthorized, "Incorrect email or password", err)
		return
	}

	pass_match ,err := auth.CheckPasswordHash(params.Password,user_db.HashedPassword)
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Something went wrong", err)
		return
	}
	if pass_match {
		duration := time.Hour
		ac_token , err := auth.MakeJWT(user_db.ID,cfg.secret,duration)
		if err != nil {
			respondWithError(c.Writer, http.StatusInternalServerError, "make JWT auth err", err)
			return
		}

		user := user_json{
			ID:        user_db.ID,
			CreatedAt: user_db.CreatedAt,
			UpdatedAt: user_db.UpdatedAt,
			Email:     user_db.Email,
			Name:      user_db.Name,
		}
		token_response := response{
			user_json: user,
			Token: ac_token,
			//RefreshToken: rf_db.Token,
		}
		respondWithJSON(c.Writer,http.StatusOK,token_response)
	}else {
		respondWithError(c.Writer, http.StatusUnauthorized, "Incorrect email or password", nil)
		return
	}
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
