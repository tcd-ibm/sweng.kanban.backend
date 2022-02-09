# Project: KanbanBoardAPI
# Introduction
This api provides a number of endpoints to facilitate the logic for kanban board application.

# Authentication
Authentification is currently not required

## End-point: host_url/listAllKanbanBoards
Lists all kanban boards stored in the database and populates the referenced swimlanes in them.

### Method: GET
>```
>undefined
>```
### Response: 200
```json
[{"_id":"6203c46d9257dc018bcd3c9e","kanbanBoardTitle":"Test","kanbanBoardSwimLanes":[{"_id":"6203c46d9257dc018bcd3c9b","swimLaneTitle":"todo","__v":0},{"_id":"6203c46d9257dc018bcd3c9c","swimLaneTitle":"doing","__v":0},{"_id":"6203c46d9257dc018bcd3c9d","swimLaneTitle":"done","__v":0}],"__v":0}]
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: host_url/findKanbanBoardByTitle
Finds one board based on its title, the associated swimlanes are populated:

Requires field "title" in the header. 

If no board is found, returns a corresponding error message.

### Method: GET
>```
>undefined
>```
### Headers

|Content-Type|Value|
|---|---|
|title|Test|


### Response: 200
```json
{"_id":"6203c46d9257dc018bcd3c9e","kanbanBoardTitle":"Test","kanbanBoardSwimLanes":[{"_id":"6203c46d9257dc018bcd3c9b","swimLaneTitle":"todo","__v":0},{"_id":"6203c46d9257dc018bcd3c9c","swimLaneTitle":"doing","__v":0},{"_id":"6203c46d9257dc018bcd3c9d","swimLaneTitle":"done","__v":0}],"__v":0}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: host_url/deleteKanbanBoardByTitle
Deletes a kanban board by title. Also deletes all swimlanes referenced by the kanban board. Has no effect if kanban board is not found:

Needs the following headers:

Content-Type: application/json

Needs a title in the body formatted as json:

{'title': 'yourtitle'}
### Method: DELETE
>```
>undefined
>```
### Headers

|Content-Type|Value|
|---|---|
|Content-Type|application/json|


### Body (**raw**)

```json
{"title": "Test"}
```

### Response: 200
```json
Deleted successfully, deleted swimLanes: 6203c46d9257dc018bcd3c9b,6203c46d9257dc018bcd3c9c,6203c46d9257dc018bcd3c9d
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: host_url/createNewKanbanBoard
Creates a new kanban board. Kanbanboards have to be unique by title, if kanban board already exists, has no effect.

Required headers:

Content-Type: application/json

Needs title parameter in the json body of the request:

{"title": "Pavel's board"}

### Method: POST
>```
>undefined
>```
### Headers

|Content-Type|Value|
|---|---|
|Content-Type|application/json|


### Body (**raw**)

```json
{"title": "Pavel"}
```

### Response: 200
```json
Successfully created a new kanban board
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: host_url/addSwimLaneToBoard
Adds a new SwimLane to the kanban board. If no board exists, has no effect.

Required headers:

Content-Type: application/json

Needs title parameter in the json body of the request for both kanban board and SwimLane:

{
	"kanbanBoardTitle":"Pavel",
	"swimLaneTitle": "Test"
}

### Method: POST
>```
>undefined
>```
### Headers

|Content-Type|Value|
|---|---|
|Content-Type|application/json|


### Body (**raw**)

```json
{
	"kanbanBoardTitle":"Pavel",
	"swimLaneTitle": "Test"
}
```

### Response: 200
```json
{"_id":"6203c4cf9257dc018bcd3ca9","kanbanBoardTitle":"Pavel","kanbanBoardSwimLanes":["6203c4f69257dc018bcd3cac"],"__v":0}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: host_url/addDummyData
For testing purposes only. Adds a dummy kanban board titled "Test" and 3 associated swim lanes when accessed.

Does not care about headers and body.
### Method: POST
>```
>undefined
>```
### Response: 200
```json
Succesfully added dummy data!
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: host_url/deleteAllBoards
For testing purposes only. Deletes all boards, but does not affect swimlanes.

Does not care about header and body.
### Method: DELETE
>```
>undefined
>```
### Response: 200
```json
Succesfully deleted all boards!
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: host_url/deleteAllSwimLanes
For testing purposes only! Deletes all swim lanes but does not affect the references in kanban boards.

Does not care about header and body.
### Method: DELETE
>```
>undefined
>```
### Response: 200
```json
Succesfully deleted all SwimLanes!
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)