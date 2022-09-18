const express = require("express");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

const app = express();

app.use(express.json());

// 데이터를 가져올 때 사용
app.get("/", (req, res) => {
  const { author, message } = req.query;

  res.json(
    data
      .filter((value) => (author ? value.author.includes(author) : true))
      .filter((value) => (message ? value.message.includes(message) : true))
  );
});

app.get("/random", (req, res) => {
  const rand = Math.floor(Math.random() * data.length);

  res.json(data[rand]);
});

app.get("/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.json({ rs: false, msg: "id is not number!" });
    return;
  }

  const num = parseInt(id);

  if (num >= data.length || num < 0) {
    res.json({ rs: false, msg: "num is not valid" });
    return;
  }
  res.json(data[num]);
});

// 데이터를 생성할 때 사용
app.post("/", (req, res) => {
  const { author, message } = req.body;

  if (!(author && author.length > 0 && message && message.length > 0)) {
    res.json({ rs: false });
    return;
  }

  data.push({
    author: req.body.author,
    message: req.body.message,
  });

  res.json({
    rs: true,
  });
});

// 데이터를 삭제할 때 사용
app.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.json({ rs: false, msg: "id is not number!" });
    return;
  }

  const num = parseInt(id);

  if (num >= data.length || num < 0) {
    res.json({ rs: false, msg: "num is not valid" });
    return;
  }

  data.splice(num, 1);

  res.json({ rs: true });
});

// 데이터를 수정할 때 사용
app.put("/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.json({ rs: false, msg: "id is not number!" });
    return;
  }

  const num = parseInt(id);

  if (num >= data.length || num < 0) {
    res.json({ rs: false, msg: "num is not valid" });
    return;
  }

  const { author, message } = req.body;

  if (!(author && author.length > 0 && message && message.length > 0)) {
    res.json({ rs: false });
    return;
  }

  data[num] = {
    author: req.body.author,
    message: req.body.message,
  };

  res.json({
    rs: true,
  });
});

app.listen(3000, () => {
  console.log("start server!");
});
