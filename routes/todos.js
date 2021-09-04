const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");

// Express Validator
const { check, validationResult } = require("express-validator");

// Custom Helper Methods
const {
  getTodos,
  getTodoByID,
  addNewTodo,
  updateTodo,
  updateCompletedStatusOfTodo,
  deleteTodo,
} = require("../config/dynamodb");

//
// Routes

// @Route:  GET - /api/todos
// @Desc:   Get all Todos from DB
// @Access: Public
router.get("/", async (req, res) => {
  try {
    const todos = await getTodos();
    res.json(todos.Items);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

// @Route:  GET - /api/todos/:id
// @Desc:   Get one Todo by ID from DB
// @Access: Public
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await getTodoByID(id);
    if (todo.Item) {
      res.json(todo.Item);
    } else {
      res.json({ error: "Todo Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

// @Route:  POST - /api/todos
// @Desc:   Create/Post a Todo
// @Access: Public
router.post(
  "/",
  [check("title", "Title is a Required Field!").not().isEmpty()],
  async (req, res) => {
    //   Checking validation errors
    const errors = validationResult(req);

    // If there are errors, returning the first one.
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0] });
    }

    // If there are no validation errors, proceed
    const todo = req.body;
    todo.id = uuid();
    todo.completed = false;

    try {
      const newTodo = await addNewTodo(todo);
      res.json(newTodo);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);

// @Route:  PUT - /api/todos/:id
// @Desc:   Update a Todo
// @Access: Public
router.put(
  "/:id",
  [check("title", "Title is a Required Field!").not().isEmpty()],
  async (req, res) => {
    //   Checking validation errors
    const errors = validationResult(req);

    // If there are errors, returning the first one.
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0] });
    }

    // If there are no validation errors, proceed
    const { id } = req.params;
    const todo = req.body;

    try {
      let updatedTodo = await updateTodo(id, todo);
      if (!updatedTodo || !updatedTodo.Attributes || updatedTodo === null) {
        res.status(400).json({ error: "Todo Not Found!" });
      }
      updatedTodo = { ...updatedTodo.Attributes, ...todo };
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);

// @Route:  PATCH - /api/todos/:id
// @Desc:   Update the 'Completed' status of a Todo
// @Access: Public
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTodo = await updateCompletedStatusOfTodo(id);
    if (!updatedTodo || !updatedTodo.Attributes || updatedTodo === null) {
      res.status(400).json({ error: "Todo Not Found!" });
    }
    res.json(updatedTodo.Attributes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

// @Route:  DELETE - /api/todos/:id
// @Desc:   Delete a Todo by ID from DB
// @Access: Public
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await deleteTodo(id);
    if (deletedTodo.Attributes) {
      res.json(deletedTodo.Attributes);
    } else {
      res.json({ error: "Todo Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

module.exports = router;
