import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const initialSelectedItem = {
  name: "",
  quantity: 0,
  price: 0,
  inventory: 0,
};

const initialApiCallState = {
  fetchInventoryError: false,
  addToDBError: false,
  addToDBSuccess: false,
};

function App() {
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [apiCallStatus, setApiCallStatus] = useState(initialApiCallState);

  const fetchInventory = () => {
    try {
      axios
        .get("http://localhost:8000/inventory")
        .then((res) => {
          if (res.status === 200) {
            // set response data into state
            setInventory(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setApiCallStatus((prevState) => {
            return { ...prevState, fetchInventoryError: true };
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // calculate the new cost
  useEffect(() => {
    let total = 0;
    if (selectedItems.length > 0) {
      selectedItems.map((item) => {
        return (total += item.quantity * item.price);
      });
    }
    setTotalCost(parseFloat(total.toFixed(2)));
  }, [selectedItems]);

  // when inventory changes, update the max number for the options
  useEffect(() => {
    if (inventory.length > 0 && selectedItem.name) {
      const targetItem = inventory.filter((item) => {
        return item.name === selectedItem.name;
      });
      setSelectedItem((prevState) => {
        return {
          ...prevState,
          inventory: targetItem[0].inventory,
        };
      });
    }
  }, [inventory]);

  const handleAddSelectedItem = (e) => {
    e.preventDefault();
    if (
      selectedItem.name !== "" &&
      selectedItem.quantity !== 0 &&
      selectedItem.price !== 0 &&
      selectedItem.inventory >= selectedItem.quantity
    ) {
      if (
        selectedItems.filter((item) => {
          return item.name === selectedItem.name;
        }).length > 0
      ) {
        const oldItem = selectedItems.filter((item) => {
          return item.name === selectedItem.name;
        })[0];
        const otherItems = selectedItems.filter((item) => {
          return item.name !== selectedItem.name;
        });
        if (
          selectedItem.quantity + oldItem.quantity <=
          selectedItem.inventory
        ) {
          setSelectedItems([
            ...otherItems,
            {
              name: selectedItem.name,
              quantity: selectedItem.quantity + oldItem.quantity,
              price: selectedItem.price,
              inventory: selectedItem.inventory,
            },
          ]);
        }
      } else {
        setSelectedItems((prevState) => {
          return [...prevState, selectedItem];
        });
      }
    }
  };

  const handleItemChange = (e) => {
    if (e.target.value === "placeholder") {
      setSelectedItem({
        ...selectedItem,
        name: "",
      });
      return;
    }
    const targetItem = inventory.filter((item) => {
      return item.name === e.target.value;
    });
    setSelectedItem((prevState) => {
      return {
        ...prevState,
        name: e.target.value,
        price: targetItem[0].price,
        inventory: targetItem[0].inventory,
      };
    });
    setApiCallStatus(initialApiCallState);
  };

  const handleQuantityChange = (e) => {
    if (e.target.value === "placeholder") {
      setSelectedItem({
        ...selectedItem,
        quantity: 0,
      });
      return;
    }
    setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) });
    setApiCallStatus(initialApiCallState);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const data = [];
    // strip the inventory property before sending to backend
    selectedItems.map((item) => {
      data.push({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      });
      return null;
    });
    if (data.length > 0) {
      axios
        .post("http://localhost:8000/addOrder", {
          items: data,
          cost: totalCost,
        })
        .then((res) => {
          if (res.status === 201) {
            // then set the success message to show
            setApiCallStatus((prevState) => {
              return { ...prevState, addToDBSuccess: true };
            });
            setSelectedItems([]);
            fetchInventory();
          }
        })
        .catch((err) => {
          console.log(err);
          setApiCallStatus((prevState) => {
            return { ...prevState, addToDBError: true };
          });
        });
    }
  };

  return (
    <div className="app">
      <h2>Welcome to Jenny's Fruit Shop!</h2>
      <div className="item-selector">
        <div>
          <label className="item-selector-padding">Item name:</label>
          <select
            defaultValue={"placeholder"}
            onChange={(e) => {
              handleItemChange(e);
            }}
            className="item-selector-padding"
          >
            <option value={"placeholder"}>Please select an item...</option>
            {inventory.length > 0 &&
              inventory.map((item) => {
                return (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div>
          <label className="item-selector-padding">Quantity:</label>
          <select
            defaultValue={"placeholder"}
            onChange={(e) => {
              handleQuantityChange(e);
            }}
            className="item-selector-padding"
          >
            <option value={"placeholder"}>0</option>
            {selectedItem.name !== "" &&
              [...Array(selectedItem.inventory)].map((val, i) => {
                return (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                );
              })}
          </select>
        </div>
        <button
          type="submit"
          onClick={handleAddSelectedItem}
          className="item-selector-padding"
        >
          Add To Order
        </button>
      </div>

      {apiCallStatus.fetchInventoryError && (
        <div className="error-text">Fetching inventory failed!</div>
      )}

      <div className="selected-items-container">
        <div className="selected-items-title">Items selected:</div>
        <div>
          {selectedItems.length > 0 &&
            selectedItems.map((item) => {
              return (
                <div key={item.name} className="selected-items">
                  {item.name}
                  {" x"}
                  {item.quantity}
                </div>
              );
            })}
        </div>
      </div>
      <div className="total-cost-container">
        <div>Total cost of items: </div>
        <div className="total-cost">${totalCost}</div>
      </div>

      <div className="submit-btn-container">
        <button
          type="submit"
          onClick={handleSubmitOrder}
          disabled={selectedItems.length === 0}
          className="submit-btn"
        >
          Submit Order
        </button>
      </div>
      {apiCallStatus.addToDBSuccess && (
        <div className="success-text">Order submitted successfully!</div>
      )}
      {apiCallStatus.addToDBError && (
        <div className="error-text">Submit order failed!</div>
      )}
    </div>
  );
}

export default App;
