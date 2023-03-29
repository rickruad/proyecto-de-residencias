const PORT = process.env.PORT || 3001;

const cors = require('cors');
const mysql = require('mysql')
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '12345asd',
  database: 'proyecto-de-residencias',
  PORT: 3306
})

db.connect();

app.post('/api/sing-up', (req, res) => {
  const username = req.body.username;
  const birthdate = req.body.birthdate;
  const email = req.body.email;
  const password = req.body.password;

  const insertData = (idToTry) => {
    db.query("INSERT INTO users (id, username, birthdate, email, password) VALUES (?,?,?,?,?)", [idToTry, username, birthdate, email, password], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          insertData(parseInt(idToTry) + 1);
        } else {
          console.log(err);
        }
      } else {
        res.send({ message: 'Cuenta registrada con éxito' });
      }
    });
  }

  insertData(1);
});

app.post('/api/sing-in', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        db.query("UPDATE users SET status = '1' WHERE email = ? AND password = ?", [email, password], (err, updateResult) => {
          if (err) {
            console.log(err);
          } else {
            console.log(updateResult);
          }
        });
        res.send(result);
        console.log(result);
      } else {
        res.send({ message: "Email o contraseña incorrecta" });
        console.log('Email o contraseña incorrecta');
      }
    }
  });
})

app.post('/api/sing-out', (req, res) => {
  db.query("SELECT * FROM users WHERE status = '1'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        db.query("UPDATE users SET status = '0' WHERE status = '1'", (err, updateResult) => {
          if (err) {
            console.log(err);
          } else {
            console.log(updateResult);
            res.send({ message: 'Success' });
          }
        });
      } else {
        console.log('error inesperado');
        console.log(result)
      }
    }
  })
})

app.post('/api/user', (req, res) => {  
  db.query("SELECT * FROM users WHERE status = '1'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send(result);
      } else {
        res.json({ message: 'USER ERROR' })
      }
    }
  });
});

app.post('/api/users', (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send(result);
      } else {
        res.json({ message: 'USER ERROR' })
      }
    }
  })
})

app.post('/api/user-status', (req, res) => {
  db.query("SELECT * FROM users WHERE status = '1'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send({ message: 1 });
      } else {
        res.send({ message: 0 });
      }
    }
  });
});

app.post('/api/delete-user', (req, res) => {
  const username = req.body.username;

  db.query("DELETE FROM users WHERE username = ?", [username], (err, result) => {
    if (err) {
      console.log(err);
    }
  })
})

app.post('/api/promote-user', (req, res) => {
  const username = req.body.username;

  db.query("UPDATE users SET admin = '1' WHERE username = ? ", [username], (err, result) => {
    if (err) {
      console.log(err);
    }
  })
})

app.post('/api/update-user', (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const birthdate = req.body.birthdate;

  db.query("UPDATE users SET email = ?, password = ?, username = ?, birthdate = ? WHERE id = ?", [email, password, username, birthdate, id], (err, result) => {
    if (err) {
      console.log(err);
      res.send({ message: sqlMessage })
    } else {
      res.send({ message: 'Actualizado los valores correctamente' });
    }
  })
})

app.post("/api/server-status", (req, res) => {
  res.json({ message: "El servidor está en linea" });
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});