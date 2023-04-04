const PORT = process.env.PORT || 3001;

const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '12345asd',
  database: 'proyecto-de-residencias',
  PORT: 3306
})

db.connect();

const storageAvatars = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./client/public/img/profile-pictures/");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop();
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "");
    const fileName = `${originalName.split(".")[0]}-${timestamp}.${extension}`;
    cb(null, fileName);
  },
});

const uploadAvatars = multer({ storage: storageAvatars });

app.post('/api/sing-up', uploadAvatars.single("image"), (req, res) => {
  const username = req.body.username;
  const birthdate = req.body.birthdate;
  const email = req.body.email;
  const password = req.body.password;

  const imageUrl = `/img/profile-pictures/${req.file.filename}`;
  const query = 'INSERT INTO users (id, username, birthdate, email, password, profilePicture) VALUES (?,?,?,?,?,?)'

  const insertData = (idToTry) => {
    db.query(query, [idToTry, username, birthdate, email, password, imageUrl], (err, result) => {
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

app.post('/api/update-user', uploadAvatars.single("image"), (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const birthdate = req.body.birthdate;
  const oldProfilePicture = req.body.profilePicture;
  const profilePicture = `/img/profile-pictures/${req.file.filename}`;

  const query = 'UPDATE users SET email = ?, password = ?, username = ?, birthdate = ?, profilePicture = ? WHERE id = ?';
  const values = [email, password, username, birthdate, profilePicture ? profilePicture : oldProfilePicture, id];

  db.query(query, values, (err, result) => {
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

app.post("/api/get-products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if(err) {
      console.log(err);
    } else {
      if(result.length > 0) {
        res.send(result);
      } else {
        res.json({ message: 'PRODUCT ERROR' });
      }
    }
  })
})

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});