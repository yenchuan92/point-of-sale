import { MongoClient } from "mongodb";
import { DB_USER_PASSWORD, DB_USER_NAME } from "./constants.js";
// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://" +
  DB_USER_NAME +
  ":" +
  DB_USER_PASSWORD +
  "@pointofsale.ggpkdnj.mongodb.net/?retryWrites=true&w=majority";

// const validateQuantity = async (data, inventory) => {
//   // validate that the inventory is not zero!
//   await data.items.map(async (item) => {
//     const result = await inventory.findOne({ name: item.name });
//     console.log(result, "res from findOne");
//     if (result.inventory < item.quantity) {
//       return true;
//     }
//   });
// };

export const addOrder = async (data) => {
  //validate data
  if (data.items.length === 0 || data.cost === 0) {
    return new Error("Invalid order!");
  }

  const client = new MongoClient(uri);
  const database = client.db("point-of-sale");
  const inventory = database.collection("inventory");
  const orders = database.collection("orders");
  try {
    // let isValid = false;

    // check whether inventory >= quantity
    // isValid = await validateQuantity(data, inventory);

    // update all the inventories
    data.items.map(async (item) => {
      await inventory.updateOne(
        { name: item.name, inventory: { $gte: item.quantity } },
        { $inc: { inventory: -item.quantity } }
      );
      return;
    });

    // add order to collection
    const final = await orders.insertOne({
      items: data.items,
      cost: data.cost,
    });

    return final;
  } catch (err) {
    console.log(err);
    return new Error("Add order failed!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

export const getInventory = async () => {
  const client = new MongoClient(uri);
  const database = client.db("point-of-sale");
  const inventory = database.collection("inventory");
  // const orders = database.collection("orders");
  try {
    let result;
    // Query for a movie that has the title 'Back to the Future'
    // const query = { title: "Back to the Future" };
    // const cursor = inventory.find({ name: { $exists: true } }, { _id: 0 });
    const cursor = inventory.find({ inventory: { $gte: 0 } });
    result = await cursor.toArray();
    return result;
  } catch (err) {
    console.log(err);
    return new Error("Get inventory failed!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

// module.exports = { getInventory, addOrder };
const Controller = {
  getInventory,
  addOrder,
};

export default Controller;
