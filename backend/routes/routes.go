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
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func StartServer(conn *pgxpool.Pool) {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://joeart.xyz", "https://www.joeart.xyz"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "This is a test message from the backend"})
	})

	godotenv.Load()

	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatalf("can't load .env %v", err)
	// }

	googleOauthConfig := &oauth2.Config{
		RedirectURL:  "https://api.joeart.xyz/auth/google/callback",
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}

	cfg := apiCfg{
		db:                database.New(conn),
		secret:            os.Getenv("SECRET"),
		googleOauthConfig: googleOauthConfig,
	}

	auth := r.Group("/")

	auth.Use(cfg.AuthMiddleware())
	{
		auth.GET("/test3", cfg.testGetuser)
		auth.POST("/testAddTask", cfg.testAddtask)
		auth.GET("/testTask", cfg.testTask)
		auth.GET("/testTaskAssignToUser", cfg.testTaskAssignToUser)
		auth.GET("/testTaskCreateByUser", cfg.testTaskCreateByUser)
		auth.POST("/testDeleteTask", cfg.testDeleteTask)
		auth.PUT("/testStatus", cfg.testUpdate)
		auth.POST("/signout", cfg.signOut)
		auth.GET("/auth/me", cfg.handlerMe)
	}

	r.POST("/testAddUser", cfg.testAdduser)
	r.POST("/testlogin", cfg.testLogin)
	r.POST("/testRefresh", cfg.refreshEndpoint)
	r.POST("/testRevoke", cfg.revokeEndpoint)
	r.GET("/auth/google", cfg.handleGoogleLogin)
	r.GET("/auth/google/callback", cfg.handleGoogleCallback)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

type apiCfg struct {
	db *database.Queries
	//platform string
	secret string
	//apikey   string
	googleOauthConfig *oauth2.Config
}

type user_json struct {
	ID        uuid.UUID        `json:"id"`
	CreatedAt pgtype.Timestamp `json:"created_at"`
	UpdatedAt pgtype.Timestamp `json:"updated_at"`
	Email     string           `json:"email"`
	Name      string           `json:"name"`
}

type GoogleUser struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}

func (cfg *apiCfg) handleGoogleLogin(c *gin.Context) {
	url := cfg.googleOauthConfig.AuthCodeURL("state-token")
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (cfg *apiCfg) handleGoogleCallback(c *gin.Context) {
	type response struct {
		user_json
		Token        string `json:"token"`
		RefreshToken string `json:"refresh_token"`
	}

	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found"})
		return
	}

	token, err := cfg.googleOauthConfig.Exchange(c.Request.Context(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}
	defer resp.Body.Close()

	var googleUser GoogleUser
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode user info"})
		return
	}

	user, err := cfg.db.GetUserByEmail(context.Background(), googleUser.Email)
	if err != nil {
		hashedPassword, err := auth.HashPassword(uuid.New().String()) // สร้างรหัสผ่านสุ่ม

		user, err = cfg.db.CreateUser(context.Background(), database.CreateUserParams{
			Email:          googleUser.Email,
			Name:           googleUser.Name,
			HashedPassword: hashedPassword,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
	}

	duration := time.Second * 6000
	ac_token, err := auth.MakeJWT(user.ID, cfg.secret, duration)
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "make JWT auth err", err)
		return
	}

	refresh_token, err := auth.MakeRefreshToken()
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "make refresh token auth err", err)
		return
	}

	_, err = cfg.db.CreateRefresh_tokens(context.Background(), database.CreateRefresh_tokensParams{
		Token:  refresh_token,
		UserID: user.ID,
	})
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Something went wrong with refresh token", err)
		return

	}

	c.SetCookie("ac_token", ac_token, 6000, "/", "", false, true)
	// c.SetCookie("ac_token", ac_token, 6000, "/", "joeart.xyz", true, true)

	c.Redirect(http.StatusTemporaryRedirect, "http://localhost:5173/task")
	// c.Redirect(http.StatusTemporaryRedirect, "https://joeart.xyz/task")
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

	pass, err := auth.HashPassword(req.Password)
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

func (cfg *apiCfg) testLogin(c *gin.Context) {
	type req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
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

	user_db, err := cfg.db.GetUserByEmail(context.Background(), params.Email)
	if err != nil {
		respondWithError(c.Writer, http.StatusUnauthorized, "Incorrect email or password", err)
		return
	}

	pass_match, err := auth.CheckPasswordHash(params.Password, user_db.HashedPassword)
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Incorrect email or password", err)
		return
	}
	if pass_match {
		duration := time.Second * 6000
		ac_token, err := auth.MakeJWT(user_db.ID, cfg.secret, duration)
		if err != nil {
			respondWithError(c.Writer, http.StatusInternalServerError, "make JWT auth err", err)
			return
		}

		refresh_token, err := auth.MakeRefreshToken()
		if err != nil {
			respondWithError(c.Writer, http.StatusInternalServerError, "make refresh token auth err", err)
			return
		}

		refresh_db, err := cfg.db.CreateRefresh_tokens(context.Background(), database.CreateRefresh_tokensParams{
			Token:  refresh_token,
			UserID: user_db.ID,
		})
		if err != nil {
			respondWithError(c.Writer, http.StatusInternalServerError, "Something went wrong with refresh token", err)
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
			user_json:    user,
			Token:        ac_token,
			RefreshToken: refresh_db.Token,
		}

		//cfg.user = user
		c.SetCookie("ac_token", ac_token, 6000, "/", "", false, true)
		// c.SetCookie("ac_token", ac_token, 6000, "/", "joeart.xyz", true, true)

		respondWithJSON(c.Writer, http.StatusOK, token_response)
	} else {
		respondWithError(c.Writer, http.StatusUnauthorized, "Incorrect email or password", nil)
		return
	}
}

type task_json struct {
	ID          uuid.UUID        `json:"id"`
	Title       string           `json:"title"`
	Description string           `json:"description"`
	Status      string           `json:"status"`
	Priority    string           `json:"priority"`
	AssignedTo  uuid.UUID        `json:"assigned_to"`
	CreatedBy   uuid.UUID        `json:"created_by"`
	CreatedAt   pgtype.Timestamp `json:"created_at"`
	UpdatedAt   pgtype.Timestamp `json:"updated_at"`
	StartDate   pgtype.Timestamp `json:"start_date"`
	DueDate     pgtype.Timestamp `json:"due_date"`
}

func (cfg *apiCfg) testAddtask(c *gin.Context) {
	type parameters struct {
		Title       string           `json:"title"`
		Description string           `json:"description"`
		Status      string           `json:"status"`
		Priority    string           `json:"priority"`
		User_Email  string           `json:"user_email"`
		StartDate   pgtype.Timestamp `json:"start_date"`
		DueDate     pgtype.Timestamp `json:"due_date"`
	}

	//if code, msg, err := cfg.cookieHandler(c); err != nil {
	//	respondWithError(c.Writer, code, msg, err)
	//	return
	//}

	userIDAny, _ := c.Get(CtxUserID)
	userID := userIDAny.(uuid.UUID)

	var params parameters

	if err := c.ShouldBindJSON(&params); err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	/*bearer_token, err := auth.GetBearerToken(c.Request.Header)
	if err != nil {
		respondWithError(c.Writer, http.StatusUnauthorized, "unauth bearer token", err)
		return
	}

	valid_uid, err := auth.ValidateJWT(bearer_token, cfg.secret)
	if err != nil {
		respondWithError(c.Writer, http.StatusUnauthorized, "JWT invalid", err)
		return
	}*/

	task_db, err := cfg.db.CreateTask(context.Background(), database.CreateTaskParams{
		Title:       params.Title,
		Description: params.Description,
		Status:      database.ProgessStatus(params.Status),
		Priority:    database.PriorityStatus(params.Priority),
		Email:       params.User_Email,
		CreatedBy:   userID,
		StartDate:   params.StartDate,
		DueDate:     params.DueDate})

	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Couldn't create user", err)
		return
	}

	task := task_json{
		ID:          task_db.ID,
		Title:       task_db.Title,
		Description: task_db.Description,
		Status:      string(task_db.Status),
		Priority:    string(task_db.Priority),
		AssignedTo:  task_db.AssignedTo,
		CreatedBy:   task_db.CreatedBy,
		CreatedAt:   task_db.CreatedAt,
		UpdatedAt:   task_db.UpdatedAt,
		StartDate:   task_db.StartDate,
		DueDate:     task_db.DueDate,
	}

	respondWithJSON(c.Writer, http.StatusCreated, task)
}

type task_nameuser_json struct {
	task_json
	Name string `json:"name"`
}

func (cfg *apiCfg) testTask(c *gin.Context) {

	//if code, msg, err := cfg.cookieHandler(c); err != nil {
	//	respondWithError(c.Writer, code, msg, err)
	//	return
	//}

	//userIDAny, _ := c.Get(CtxUserID)
	//userID := userIDAny.(uuid.UUID)

	task_db, err := cfg.db.GetAllTasks(context.Background())
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Couldn't get tasks", err)
		return
	}

	var all_task []task_nameuser_json
	for _, task_val := range task_db {
		all_task = append(all_task, task_nameuser_json{
			task_json: task_json{
				ID:          task_val.ID,
				Title:       task_val.Title,
				Description: task_val.Description,
				Status:      string(task_val.Status),
				Priority:    string(task_val.Priority),
				AssignedTo:  task_val.AssignedTo,
				CreatedBy:   task_val.CreatedBy,
				CreatedAt:   task_val.CreatedAt,
				UpdatedAt:   task_val.UpdatedAt,
				StartDate:   task_val.StartDate,
				DueDate:     task_val.DueDate,
			},
			Name: task_val.Name,
		})
	}

	respondWithJSON(c.Writer, http.StatusOK, all_task)
}

func (cfg *apiCfg) testTaskAssignToUser(c *gin.Context) {

	//if code, msg, err := cfg.cookieHandler(c); err != nil {
	//	respondWithError(c.Writer, code, msg, err)
	//	return
	//}
	userIDAny, _ := c.Get(CtxUserID)
	userID := userIDAny.(uuid.UUID)

	task_db, err := cfg.db.GetAllTasksAssignToUser(context.Background(), userID)
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Couldn't get tasks", err)
		return
	}

	var all_task []task_nameuser_json
	for _, task_val := range task_db {
		all_task = append(all_task, task_nameuser_json{
			task_json: task_json{
				ID:          task_val.ID,
				Title:       task_val.Title,
				Description: task_val.Description,
				Status:      string(task_val.Status),
				Priority:    string(task_val.Priority),
				AssignedTo:  task_val.AssignedTo,
				CreatedBy:   task_val.CreatedBy,
				CreatedAt:   task_val.CreatedAt,
				UpdatedAt:   task_val.UpdatedAt,
				StartDate:   task_val.StartDate,
				DueDate:     task_val.DueDate,
			},
			Name: task_val.Name,
		})
	}
	respondWithJSON(c.Writer, http.StatusOK, all_task)
}

func (cfg *apiCfg) testTaskCreateByUser(c *gin.Context) {

	//if code, msg, err := cfg.cookieHandler(c); err != nil {
	//	respondWithError(c.Writer, code, msg, err)
	//	return
	//}
	userIDAny, _ := c.Get(CtxUserID)
	userID := userIDAny.(uuid.UUID)

	task_db, err := cfg.db.GetAllTasksUserCreate(context.Background(), userID)
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Couldn't get tasks", err)
		return
	}

	var all_task []task_nameuser_json
	for _, task_val := range task_db {
		all_task = append(all_task, task_nameuser_json{
			task_json: task_json{
				ID:          task_val.ID,
				Title:       task_val.Title,
				Description: task_val.Description,
				Status:      string(task_val.Status),
				Priority:    string(task_val.Priority),
				AssignedTo:  task_val.AssignedTo,
				CreatedBy:   task_val.CreatedBy,
				CreatedAt:   task_val.CreatedAt,
				UpdatedAt:   task_val.UpdatedAt,
				StartDate:   task_val.StartDate,
				DueDate:     task_val.DueDate,
			},
			Name: task_val.Name,
		})
	}
	respondWithJSON(c.Writer, http.StatusOK, all_task)
}

func (cfg *apiCfg) testDeleteTask(c *gin.Context) {
	type req struct {
		Task_id uuid.UUID `json:"task_id"`
	}

	//if code, msg, err := cfg.cookieHandler(c); err != nil {
	//	respondWithError(c.Writer, code, msg, err)
	//	return
	//}

	userIDAny, _ := c.Get(CtxUserID)
	userID := userIDAny.(uuid.UUID)

	var param req
	if err := c.ShouldBindJSON(&param); err != nil {
		respondWithError(c.Writer, 400, "invalid request payload", err)
		return
	}

	err := cfg.db.DeleteTaskByID(context.Background(), database.DeleteTaskByIDParams{
		ID:        param.Task_id,
		CreatedBy: userID,
	})

	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Couldn't delete tasks", err)
		return
	}

	respondWithJSON(c.Writer, http.StatusOK, nil)
}

func (cfg *apiCfg) testUpdate(c *gin.Context) {
	type req struct {
		Task_id uuid.UUID `json:"task_id"`
		Status  string    `json:"status"`
	}

	//if code, msg, err := cfg.cookieHandler(c); err != nil {
	//	respondWithError(c.Writer, code, msg, err)
	//	return
	//}

	userIDAny, _ := c.Get(CtxUserID)
	userID := userIDAny.(uuid.UUID)

	var param req
	if err := c.ShouldBindJSON(&param); err != nil {
		respondWithError(c.Writer, 400, "invalid request payload", err)
		return
	}

	// aerr := cfg.db.DeleteTaskByID(context.Background(), database.DeleteTaskByIDParams{
	// 	ID:        param.Task_id,
	// 	CreatedBy: userID,
	// })

	res, err := cfg.db.UpdateTaskByID(context.Background(), database.UpdateTaskByIDParams{
		ID:         param.Task_id,
		Status:     database.ProgessStatus(param.Status),
		AssignedTo: userID,
	})

	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "Couldn't update tasks", err)
		return
	}

	respondWithJSON(c.Writer, http.StatusOK, res)
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

func (cfg *apiCfg) refreshEndpoint(c *gin.Context) {
	type returnVals struct {
		Token string `json:"token"`
	}

	refresh_token, err := auth.GetBearerToken(c.Request.Header)
	if err != nil {
		respondWithError(c.Writer, http.StatusBadRequest, "Couldn't find token", err)
		return
	}

	user_db, err := cfg.db.GetUserFromRefreshToken(context.Background(), refresh_token)
	if err != nil {
		respondWithError(c.Writer, http.StatusUnauthorized, "Couldn't get user Refresh token", err)
		return
	}

	//old filter
	//if rf_token_db.ExpiresAt.Before(time.Now()) || !rf_token_db.RevokedAt.Valid {
	//	respondWithError(w, http.StatusUnauthorized, "token expire", err)
	//	return
	//}

	new_access_token, err := auth.MakeJWT(user_db.ID, cfg.secret, time.Hour)
	if err != nil {
		respondWithError(c.Writer, http.StatusInternalServerError, "something wrong with make JWT", err)
		return
	}
	value := returnVals{
		Token: new_access_token,
	}

	respondWithJSON(c.Writer, http.StatusOK, value)

}

func (cfg *apiCfg) revokeEndpoint(c *gin.Context) {

	rf_token, err := auth.GetBearerToken(c.Request.Header)
	if err != nil {
		respondWithError(c.Writer, http.StatusBadRequest, "Couldn't find token", err)
		return
	}

	err = cfg.db.UpdateRefreshTokenRevoke(context.Background(), rf_token)
	if err != nil {
		respondWithError(c.Writer, http.StatusUnauthorized, "Couldn't Revoke refresh token", err)
		return
	}

	respondWithJSON(c.Writer, http.StatusNoContent, nil)

}

func (cfg *apiCfg) signOut(c *gin.Context) {
	c.SetCookie("ac_token", "", -1, "/", "", false, true)

	cfg.revokeEndpoint(c)

	respondWithJSON(c.Writer, http.StatusOK, "Signed out successfully")
}

func (cfg *apiCfg) handlerMe(c *gin.Context) {

	//if code, msg, err := cfg.cookieHandler(c); err != nil {
	//	respondWithError(c.Writer, code, msg, err)
	//	return
	//}
	userIDAny, _ := c.Get(CtxUserID)
	userID := userIDAny.(uuid.UUID)

	//old way waste of time
	user_db, err := cfg.db.GetUserByID(context.Background(), userID)
	if err != nil {
		respondWithError(c.Writer, http.StatusNotFound, "User not found", err)
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

/*func (cfg *apiCfg) cookieHandler(c *gin.Context) (httpcode int, msg string, err error) {

	access_token, err := c.Cookie("ac_token")
	if err != nil {
		//respondWithError(c.Writer, http.StatusUnauthorized, "No access token found", err)
		return http.StatusUnauthorized, "No cookie access token found", err
	}

	user_id, err := auth.ValidateJWT(access_token, cfg.secret)
	if err != nil {
		//respondWithError(c.Writer, http.StatusUnauthorized, "Invalid token", err)
		return http.StatusUnauthorized, "Invalid token", err
	}

	if user_id != cfg.user.ID {
		return http.StatusUnauthorized, "hey what r u trying to do man", err
	}

	return

}*/

const CtxUserID = "user_id"

func (cfg *apiCfg) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		accessToken, err := c.Cookie("ac_token")
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "no access token"})
			return
		}

		userID, err := auth.ValidateJWT(accessToken, cfg.secret)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		c.Set(CtxUserID, userID)

		c.Next()
	}
}
