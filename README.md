# MI_Inventory
Inventory application to the musical Apornas ö. Contains two parts:
* A web server to control and display the inventory (and achievements)
* An application which may display the webpage on a transparent window (using Electron)

Available items and achivements can be added/removed/edited in the file `res/static_data.json`.

## Requirements
NodeJS v10.0+ . Make is nice but not required.

## 

### Running with make
The following commands start the different modules:

| Command                     | Outcome                                                             |
| --------------------------- | ------------------------------------------------------------------- |
| make dev                    | Run inventory server on port 4218                                   |
| make -C transparent_web dev | Run electron window displaying the webpage on http://localhost:4218 |

### Running with npm
To run the server:
```
npm ci
npm run dev
```

To run the electron window:
```
cd transparent_web
npm ci
npm run dev
```