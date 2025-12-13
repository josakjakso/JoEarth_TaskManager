// routes/routes.go
package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func StartServer() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "This is a test message from the backend"})
	})
	r.GET("/test2",testMsg)
	r.Run(":8080")
}


func testMsg (c *gin.Context){
	c.JSON(200, gin.H{"message": "This is a test message from the backend"})
}