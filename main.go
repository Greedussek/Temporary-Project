//	func generateGrid(rows, cols, percent int) [][]int {
//		rand.New(rand.NewSource(time.Now().UnixNano()))
//		grid := make([][]int, rows)
//		for i := 0; i < rows; i++ {
//			grid[i] = make([]int, cols)
//			for j := 0; j < cols; j++ {
//				if rand.Intn(100) < percent {
//					grid[i][j] = 1
//				} else {
//					grid[i][j] = 2
//				}
//			}
//		}
//		return grid
//	}
package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func createVillageWithResources(app core.App, userID string) error {

	villageCollection, err := app.FindCollectionByNameOrId("village")
	if err != nil {
		return err
	}

	villageRecord := core.NewRecord(villageCollection)
	villageRecord.Set("name", "New_Village")
	villageRecord.Set("user", userID)

	if err := app.Save(villageRecord); err != nil {
		return err
	}

	resourcesCollection, err := app.FindCollectionByNameOrId("resources")
	if err != nil {
		return err
	}

	resourcesRecord := core.NewRecord(resourcesCollection)
	resourcesRecord.Set("wood", 0)
	resourcesRecord.Set("stone", 0)
	resourcesRecord.Set("gold", 0)
	resourcesRecord.Set("steel", 0)
	resourcesRecord.Set("village", villageRecord.Id)

	if err := app.Save(resourcesRecord); err != nil {
		return err
	}

	return nil
}

func main() {
	app := pocketbase.New()
	app.OnRecordCreateRequest("village").BindFunc(func(e *core.RecordRequestEvent) error {
		userID := e.Auth.Id
		return createVillageWithResources(app, userID)
	})
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), false))
		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
