import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditID] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      showAlert(true, "please enter values", "danger");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setEditID(null);
      setIsEditing(false);
      setName("");
    } else {
      showAlert(true, "Items added to the list", "success");
      const newItems = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItems]);

      setName("");
    }
  };

  const showAlert = (show, msg, type) => {
    setAlert({ show, msg, type });
  };

  const clearList = () => {
    showAlert(true, "empty list", "danger");
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, "Item removed", "danger");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  });
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
