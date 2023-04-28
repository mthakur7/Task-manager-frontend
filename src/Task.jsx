import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const Task = () => {
  const [show, setShow] = useState(true);
  const [pri, setPri] = useState("All");
  const [idd, setIdd] = useState(null);
  const [edittask, setEdittask] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    task: "",
    date: "",
    priority: "",
  });
  const [text, setText] = useState([]);

  const navigate = useNavigate();
  const callTaskPage = async () => {
    try {
      const response = await fetch("/getdata", {
        method: "GET",
        headers: {
          Content_Type: "application/json",
        },
      });
      const data = await response.json();
      if (data.tasks.length > 0) setText(data.tasks);

      if (!response.status === 200) {
        throw new Error(response.error);
      }
    } catch (err) {
      console.log(err);
      navigate("/login"); //if user is not authenticate then we show login page else by default this contact page will be shown
    }
  };

  useEffect(() => {
    callTaskPage();
  }, []);

  function fun(e) {
    let name = e.target.name;
    let value = e.target.value;

    setUserData((preVal) => {
      return { ...preVal, [name]: value };
    });
  }
  //sending data to db
  const sub = async (e) => {
    e.preventDefault();
    const { name, task, date, priority } = userData;

    const res = await fetch("/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        task: task,
        date: date,
        priority: priority,
      }),
    });

    const data = await res.json();

    setText((pre) => {
      return [...pre, userData];
    });
    callTaskPage();
    if (!data) console.log("Task not added");
    else {
      alert("Task Added");
      setUserData({ ...userData, name: "", task: "", date: "", priority: "" });
    }
  };
  const del = async (e, val) => {
    e.preventDefault();

    let arr = text.filter((ele) => {
      return val._id !== ele._id;
    });

    let res = await fetch("/delTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: val._id,
      }),
    });
    let data = await res.json();
    console.log(data);
    if (!data) console.log("not del");
    else {
      alert("Tasl deleted");
      setText(arr);

      setUserData({ ...userData, name: "", task: "", date: "", priority: "" });
    }
  };

  const edit = (e, val, idx) => {
    e.preventDefault();
    setUserData({
      ...userData,
      name: val.name,
      task: val.task,
      date: val.date,
      priority: val.priority,
    });
    setEdittask(true);
    setIdd(idx);
  };

  const update = async (e) => {
    e.preventDefault();
    text[idd].name = userData.name;
    text[idd].task = userData.task;
    text[idd].date = userData.date;
    text[idd].priority = userData.priority;

    let arr = [...text];

    let res = await fetch("/updateTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: text[idd]._id,
        name: userData.name,
        task: userData.task,
        date: userData.date,
        priority: userData.priority,
        completed: false,
      }),
    });
    let data = await res.json();
    console.log(data);
    if (!data) console.log("not upd");
    else {
      alert("Task updated");
      setText(arr);

      setUserData({ ...userData, name: "", task: "", date: "", priority: "" });
      setEdittask(false);
      callTaskPage();
    }
  };

  function choose(e) {
    setPri(e.target.value);
  }

  const mark = async (e, val, idx) => {
    e.preventDefault();
    let res = await fetch("/updateTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: val._id,
        name: val.name,
        task: val.task,
        date: val.date,
        priority: val.priority,
        completed: true,
      }),
    });
    let data = await res.json();

    if (data) console.log("completed");
    callTaskPage();
  };
  function view() {
    setShow(!show);
  }

  return (
    <div className="tasks">
      <h1>My Tasks</h1>
      <form method="POST">
        <div className="add">
          <input
            type="text"
            placeholder="name"
            name="name"
            onChange={fun}
            value={userData.name}
          />

          <input
            type="text"
            name="task"
            placeholder="description"
            value={userData.task}
            onChange={fun}
          />
          <input type="date" value={userData.date} name="date" onChange={fun} />
          <p>
            Low:{" "}
            <input type="radio" name="priority" value="Low" onChange={fun} />
            Medium:{" "}
            <input type="radio" name="priority" value="Medium" onChange={fun} />
            High:{" "}
            <input type="radio" name="priority" value="High" onChange={fun} />
          </p>

          {edittask === false ? (
            <button
              formAction="/createTask"
              type="submit"
              value="create"
              name="contact"
              onClick={sub}
            >
              Add Task
            </button>
          ) : (
            <button
              formAction="/updateTask"
              type="submit"
              value="update"
              name="contact"
              onClick={update}
            >
              Update
            </button>
          )}
          <select name="category" onChange={choose}>
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <p id="show" value="show" name="show" onClick={view}>
            Completed Tasks
          </p>
        </div>
        <div className="list">
          {text.length > 0 ? (
            text.map((val, idx) => {
              if (show === true) {
                if (val.priority === pri || pri === "All") {
                  if (val.completed === false) {
                    return (
                      <>
                        <div className="item">
                          {val.priority === "High" ? (
                            <p style={{ backgroundColor: "red" }}>{val.name}</p>
                          ) : val.priority === "Medium" ? (
                            <p style={{ backgroundColor: "orange" }}>
                              {val.name}
                            </p>
                          ) : (
                            <p style={{ backgroundColor: "green" }}>
                              {val.name}
                            </p>
                          )}
                          <p> {val.task}</p>
                          <p>Due: {new Date(val.date).toDateString()}</p>

                          {val.priority === "High" ? (
                            <p style={{ color: "red" }}>{val.priority}</p>
                          ) : val.priority === "Medium" ? (
                            <p style={{ color: "orange" }}>{val.priority}</p>
                          ) : (
                            <p style={{ color: "green" }}>{val.priority}</p>
                          )}

                          <p>
                            <DeleteIcon
                              className="icon"
                              fontSize="large"
                              formAction="/delTask"
                              value="del"
                              name="contact"
                              onClick={(e) => {
                                del(e, val);
                              }}
                            >
                              Delete
                            </DeleteIcon>

                            <EditIcon
                              className="icon"
                              fontSize="large"
                              formAction="#"
                              value="edit"
                              name="contact"
                              onClick={(e) => {
                                edit(e, val, idx);
                              }}
                            >
                              Edit
                            </EditIcon>
                          </p>
                          <button
                            id="complete"
                            formAction="/updateTask"
                            value="complete"
                            onClick={(e) => mark(e, val, idx)}
                          >
                            Mark as completed
                          </button>
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <div className="item">
                          {val.priority === "High" ? (
                            <p style={{ backgroundColor: "red" }}>{val.name}</p>
                          ) : val.priority === "Medium" ? (
                            <p style={{ backgroundColor: "orange" }}>
                              {val.name}
                            </p>
                          ) : (
                            <p style={{ backgroundColor: "green" }}>
                              {val.name}
                            </p>
                          )}
                          <p> {val.task}</p>
                          <p>Due: {new Date(val.date).toDateString()}</p>

                          {val.priority === "High" ? (
                            <p style={{ color: "red" }}>{val.priority}</p>
                          ) : val.priority === "Medium" ? (
                            <p style={{ color: "orange" }}>{val.priority}</p>
                          ) : (
                            <p style={{ color: "green" }}>{val.priority}</p>
                          )}

                          <p>
                            <DeleteIcon
                              className="icon"
                              fontSize="large"
                              formAction="/delTask"
                              value="del"
                              name="contact"
                              onClick={(e) => {
                                del(e, val);
                              }}
                            >
                              Delete
                            </DeleteIcon>

                            <EditIcon
                              className="icon"
                              fontSize="large"
                              formAction="#"
                              value="edit"
                              name="contact"
                              onClick={(e) => {
                                edit(e, val, idx);
                              }}
                            >
                              Edit
                            </EditIcon>
                          </p>
                          <p>Completed</p>
                        </div>
                      </>
                    );
                  }
                }
              } else {
                if (val.completed === true) {
                  return (
                    <>
                      <div className="item">
                        {val.priority === "High" ? (
                          <p style={{ backgroundColor: "red" }}>{val.name}</p>
                        ) : val.priority === "Medium" ? (
                          <p style={{ backgroundColor: "orange" }}>
                            {val.name}
                          </p>
                        ) : (
                          <p style={{ backgroundColor: "green" }}>{val.name}</p>
                        )}
                        <p> {val.task}</p>
                        <p>Due: {new Date(val.date).toDateString()}</p>

                        {val.priority === "High" ? (
                          <p style={{ color: "red" }}>{val.priority}</p>
                        ) : val.priority === "Medium" ? (
                          <p style={{ color: "orange" }}>{val.priority}</p>
                        ) : (
                          <p style={{ color: "green" }}>{val.priority}</p>
                        )}

                        <p>
                          <DeleteIcon
                            className="icon"
                            fontSize="large"
                            formAction="/delTask"
                            value="del"
                            name="contact"
                            onClick={(e) => {
                              del(e, val);
                            }}
                          >
                            Delete
                          </DeleteIcon>

                          <EditIcon
                            className="icon"
                            fontSize="large"
                            formAction="#"
                            value="edit"
                            name="contact"
                            onClick={(e) => {
                              edit(e, val, idx);
                            }}
                          >
                            Edit
                          </EditIcon>
                        </p>
                        <p>Completed</p>
                      </div>
                    </>
                  );
                }
              }
            })
          ) : (
            <p style={{ color: "white", margin: "20px", fontSize: "20px" }}>
              NO TASKS TO DISPLAY
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Task;
