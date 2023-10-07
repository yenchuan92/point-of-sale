Welcome to the Point of Sale demo!
Frontend was bootstrapped with CRA.
Backend uses NodeJS and Express for routing, MongoDB Atlas (cloud db) for database.

To run the program, first ensure you have npm and nodejs installed.

To run the frontend, open a command prompt and cd into the point-of-sale-frontend folder.
Run "npm install" to install the node modules.
Run the command "npm start", this will start the application on port 3000.

To run the backend, open a command prompt and cd into the point-of-sale-backend folder.
Run "npm install" to install the node modules.
Run the command "npm start", this will start the application on port 8000.

For the MongoDB Atlas,
DB queries are written using the NodeJS MongoDB Atlas client syntax.
Connection is similar to the mongoose client, except that the data is stored in the cloud.
To change the target database, simply change the URL constants in the constants.js file, as well as the uri on the backend Controller.js.
Current implementation of the database is a database called point-of-sale, with 2 collections, inventory and orders.
If changing the database, add the following data to the inventory collection.
[
{
_id: ObjectId('any'),
name: "Apple",
price: 2,
inventory: 20
},
{
_id: ObjectId('any'),
name: "Banana",
price: 1.5,
inventory: 20
},
{
_id: ObjectId('any'),
name: "Pear",
price: 2.3,
inventory: 20
},
{
_id: ObjectId('any'),
name: "Orange",
price: 1.8,
inventory: 20
}
]

Further potential improvements (not including new features/functionality)
-Use typescript to validate the data types, especially for the cost
-Figure out how to chain multiple mongodb in transaction format, if possible
-Extract out components into separate files, each with their own state
-Or just optimize the rerendering based on state changes
