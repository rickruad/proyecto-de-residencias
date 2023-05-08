import localConfig from "../local-config.js";

const { DBNAME, DBPASSWORD, DBPORT } = localConfig.connectionDatabase();
const { SVPORT } = localConfig.connectionServer();

const PORT = process.env.PORT || SVPORT;

import fs from "fs";
import path from "path";
import cors from "cors";
import mysql from "mysql";
import multer from "multer";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: DBPASSWORD,
  database: DBNAME,
  PORT: DBPORT,
});

db.connect();

const currentDirectory = decodeURI(
  path.dirname(import.meta.url).replace(/^file:\/\/\//, "")
);

const folderPathPFP = path.join(
  currentDirectory,
  "../client/public/img/profile-pictures"
);
fs.mkdir(folderPathPFP, { recursive: true }, (err) => {
  if (err) throw err;
});

const folderPathPP = path.join(
  currentDirectory,
  "../client/public/img/products-pictures"
);
fs.mkdir(folderPathPP, { recursive: true }, (err) => {
  if (err) throw err;
});

const createUsersTable =
  "CREATE TABLE users (" +
  "id INT PRIMARY KEY NOT NULL UNIQUE, " +
  "email VARCHAR(45) NOT NULL UNIQUE, " +
  "password VARCHAR(45) NOT NULL, " +
  "username VARCHAR(45) NOT NULL UNIQUE, " +
  "birthdate VARCHAR(45) NOT NULL, " +
  "profilePicture VARCHAR(256) NULL, " +
  "status INT NOT NULL DEFAULT '0', " +
  "admin INT NOT NULL DEFAULT '0')";

const createProductsTable =
  "CREATE TABLE products (" +
  "id INT PRIMARY KEY NOT NULL UNIQUE, " +
  "product VARCHAR(100) NOT NULL, " +
  "dateadded VARCHAR(45) NOT NULL, " +
  "image LONGTEXT NOT NULL, " +
  "description VARCHAR(256) NOT NULL, " +
  "cashback VARCHAR(45) NOT NULL, " +
  "price VARCHAR(45) NOT NULL DEFAULT '0', " +
  "category VARCHAR(45) NOT NULL, " +
  "type VARCHAR(45) NOT NULL)";

const createUsersCartTable =
  "CREATE TABLE userscart (" +
  "id INT PRIMARY KEY NOT NULL UNIQUE, " +
  "username VARCHAR(45) NOT NULL, " +
  "dateadded VARCHAR(45) NOT NULL, " +
  "product VARCHAR(45) NOT NULL, " +
  "priceselected VARCHAR(45) NOT NULL, " +
  "cashback VARCHAR(45) NOT NULL, " +
  "quantity VARCHAR(45) NOT NULL)";

const createHistoryTable =
  "CREATE TABLE history (" +
  "id INT PRIMARY KEY NOT NULL UNIQUE, " +
  "username VARCHAR(45) NOT NULL, " +
  "products MEDIUMTEXT NOT NULL, " +
  "date VARCHAR(45) NOT NULL, " +
  "dateadded VARCHAR(45) NOT NULL, " +
  "totalprice VARCHAR(45) NOT NULL)";

const createUserInfoBuyTable =
  "CREATE TABLE userinfobuy (" +
  "id INT PRIMARY KEY NOT NULL UNIQUE, " +
  "username VARCHAR(45) NOT NULL, " +
  "type VARCHAR(45) NOT NULL, " +
  "namecard VARCHAR(64) NOT NULL, " +
  "numbercard VARCHAR(45) NOT NULL, " +
  "expirationdatecard VARCHAR(45) NOT NULL, " +
  "securitycodecard VARCHAR(45) NOT NULL, " +
  "fullname VARCHAR(64) NOT NULL, " +
  "country VARCHAR(45) NOT NULL, " +
  "locality VARCHAR(45) NOT NULL, " +
  "firstdirection VARCHAR(45) NOT NULL, " +
  "seconddirection VARCHAR(45) NULL, " +
  "postalcode VARCHAR(45) NOT NULL, " +
  "phonenumber VARCHAR(45) NOT NULL)";

db.query(createUsersTable, (err, result) => {
  if (err) {
    if (err.code !== "ER_TABLE_EXISTS_ERROR") {
      console.log(err);
    }
  }
});

db.query(createProductsTable, (err, result) => {
  if (err) {
    if (err.code !== "ER_TABLE_EXISTS_ERROR") {
      console.log(err);
    }
  }
});

db.query(createUsersCartTable, (err, result) => {
  if (err) {
    if (err.code !== "ER_TABLE_EXISTS_ERROR") {
      console.log(err);
    }
  }
});

db.query(createHistoryTable, (err, result) => {
  if (err) {
    if (err.code !== "ER_TABLE_EXISTS_ERROR") {
      console.log(err);
    }
  }
});

db.query(createUserInfoBuyTable, (err, result) => {
  if (err) {
    if (err.code !== "ER_TABLE_EXISTS_ERROR") {
      console.log(err);
    }
  }
});

db.query(
  "INSERT INTO users (id, username, birthdate, email, password, profilePicture, status, admin) VALUES (?,?,?,?,?,?,?,?)",
  ["1", "admin", "2000-01-01", "admin@admin.com", "admin", null, "0", "1"],
  (err, result) => {
    if (err) {
      if (err.code !== "ER_DUP_ENTRY") {
        console.log(err);
      }
    }
  }
);

const storageAvatars = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./client/public/img/profile-pictures/");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop();
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "");
    const fileName = `${timestamp}.${extension}`;
    cb(null, fileName);
  },
});

const uploadAvatars = multer({ storage: storageAvatars });

app.post("/api/sing-up", uploadAvatars.single("profilePicture"), (req, res) => {
  const username = req.body.username;
  const birthdate = req.body.birthdate;
  const email = req.body.email;
  const password = req.body.password;
  const thereIsProfilePicture = req.body.thereIsProfilePicture;
  var imageUrl = null;

  console.log(thereIsProfilePicture);

  if (thereIsProfilePicture === "YES") {
    imageUrl = `/img/profile-pictures/${req.file.filename}`;
  }

  const query =
    "INSERT INTO users (id, username, birthdate, email, password, profilePicture) VALUES (?,?,?,?,?,?)";

  const insertData = (idToTry) => {
    db.query(
      query,
      [idToTry, username, birthdate, email, password, imageUrl],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            insertData(parseInt(idToTry) + 1);
          } else {
            console.log(err);
          }
        } else {
          res.send({ message: "Cuenta registrada con éxito" });
        }
      }
    );
  };

  insertData(1);
});

app.post("/api/sing-in", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 0) {
          db.query(
            "UPDATE users SET status = '1' WHERE email = ? AND password = ?",
            [email, password],
            (err, updateResult) => {
              if (err) {
                console.log(err);
              } else {
                console.log(updateResult);
              }
            }
          );
          res.send(result);
          console.log(result);
        } else {
          res.send({ message: "Email o contraseña incorrecta" });
          console.log("Email o contraseña incorrecta");
        }
      }
    }
  );
});

app.post("/api/sing-out", (req, res) => {
  db.query("SELECT * FROM users WHERE status = '1'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        db.query(
          "UPDATE users SET status = '0' WHERE status = '1'",
          (err, updateResult) => {
            if (err) {
              console.log(err);
            } else {
              res.send({ message: "SUCCESS" });
            }
          }
        );
      } else {
        console.log(result);
      }
    }
  });
});

app.post("/api/user", (req, res) => {
  db.query("SELECT * FROM users WHERE status = '1'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send(result);
      } else {
        res.json({ message: "USER ERROR" });
      }
    }
  });
});

app.post("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send(result);
      } else {
        res.json({ message: "USER ERROR" });
      }
    }
  });
});

app.post("/api/user-status", (req, res) => {
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

app.post("/api/delete-user", (req, res) => {
  const id = req.body.id;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.post("/api/promote-user", (req, res) => {
  const id = req.body.id;

  db.query(
    "UPDATE users SET admin = '1' WHERE id = ? ",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
});

app.post("/api/verify-email", (req, res) => {
  const email = req.body.email;

  const query = "SELECT COUNT(*) FROM users WHERE email = ?";

  db.query(query, [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: `${result[0]["COUNT(*)"]}` });
    }
  });
});

app.post(
  "/api/update-user",
  uploadAvatars.single("profilePicture"),
  (req, res) => {
    const id = req.body.id;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const birthdate = req.body.birthdate;
    const oldProfilePicture =
      req.body.oldProfilePicture === "null" ? null : req.body.oldProfilePicture;
    const DBProfilePicture = req.file
      ? `/img/profile-pictures/${req.file.filename}`
      : oldProfilePicture;

    const query =
      "UPDATE users SET email = ?, password = ?, username = ?, birthdate = ?, profilePicture = ? WHERE id = ?";
    const values = [email, password, username, birthdate, DBProfilePicture, id];

    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ message: "SUCCESS" });
      }
    });
  }
);

app.post("/api/delete-user-cart", (req, res) => {
  const username = req.body.username;

  db.query(
    "DELETE FROM userscart WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ message: "SUCCESSFULLY DELETED" });
      }
    }
  );
});

app.post("/api/get-products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send(result);
      } else {
        res.json({ message: "PRODUCT ERROR" });
      }
    }
  });
});

const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./client/public/img/products-pictures/");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop();
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "");
    const fileName = `${timestamp}.${extension}`;
    cb(null, fileName);
  },
});

const uploadProduct = multer({ storage: storageProduct });

app.post(
  "/api/add-product",
  uploadProduct.single("productImage"),
  (req, res) => {
    const name = req.body.productName;
    const dateadded = req.body.dateAdded;
    const description = req.body.productDescription;
    const price = req.body.productPrice;
    const cashback = req.body.cashback;
    const category = req.body.productCategory;
    const type = req.body.productType;

    const imageUrl = `/img/products-pictures/${req.file.filename}`;

    const query =
      "INSERT INTO products (id, product, dateadded, image, description, price, cashback, category, type) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const insertData = (idToTry) => {
      db.query(
        query,
        [
          idToTry,
          name,
          dateadded,
          imageUrl,
          description,
          price,
          cashback,
          category,
          type,
        ],
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              insertData(parseInt(idToTry) + 1);
            } else {
              console.log(err);
            }
          } else {
            res.send({ message: "Producto agregado con exito" });
          }
        }
      );
    };

    insertData(1);
  }
);

app.post("/api/users-cart", (req, res) => {
  const username = req.body.username;
  const dateadded = req.body.dateAdded;
  const product = req.body.product;
  const priceselected = req.body.priceselected;
  const cashback = req.body.cashback;
  const quantity = req.body.quantity;

  const query =
    "INSERT INTO userscart (id, username, dateadded, product, priceselected, cashback, quantity) VALUE (?, ?, ?, ?, ?, ?, ?)";

  const insertData = (idToTry) => {
    db.query(
      query,
      [
        idToTry,
        username,
        dateadded,
        product,
        priceselected,
        cashback,
        quantity,
      ],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            insertData(parseInt(idToTry) + 1);
          } else {
            console.log(err);
          }
        }
      }
    );
  };

  insertData(1);
});

app.post("/api/get-cart", (req, res) => {
  db.query("SELECT * FROM userscart", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send(result);
      } else {
        res.json({ message: "USER ERROR" });
      }
    }
  });
});

app.post("/api/remove-product-cart", (req, res) => {
  const id = req.body.id;

  db.query("DELETE FROM userscart WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: "SUCCESS" });
    }
  });
});

app.post("/api/buy-product", (req, res) => {
  const username = req.body.username;
  const products = req.body.products;
  const date = req.body.date;
  const dateadded = req.body.dateadded;
  const totalprice = req.body.totalprice;

  const query =
    "INSERT INTO history (id, username, products, date, dateadded, totalprice) VALUE (?, ?, ?, ?, ?, ?)";

  const insertData = (idToTry) => {
    db.query(
      query,
      [idToTry, username, products, date, dateadded, totalprice],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            insertData(parseInt(idToTry) + 1);
          } else {
            console.log(err);
          }
        } else {
          db.query(
            "DELETE FROM userscart WHERE username = ?",
            [username],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send({ message: "SUCCESSFULLY DELETED" });
              }
            }
          );
        }
      }
    );
  };

  insertData(1);
});

app.post("/api/save-info-buy", (req, res) => {
  const username = req.body.username;
  const type = req.body.type;
  const numbercard = req.body.numbercard;
  const namecard = req.body.namecard;
  const expirationdatecard = req.body.expirationdatecard;
  const securitycodecard = req.body.securitycodecard;
  const fullname = req.body.fullname;
  const country = req.body.country;
  const locality = req.body.locality;
  const firstdirection = req.body.firstdirection;
  const seconddirection =
    req.body.seconddirection !== "none" ? req.body.seconddirection : null;
  const postalcode = req.body.postalcode;
  const phonenumber = req.body.phonenumber;

  const query =
    "INSERT INTO userinfobuy (id, username, type, namecard, numbercard, expirationdatecard, securitycodecard, fullname, country, locality, firstdirection, seconddirection, postalcode, phonenumber) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const insertData = (idToTry) => {
    db.query(
      query,
      [
        idToTry,
        username,
        type,
        namecard,
        numbercard,
        expirationdatecard,
        securitycodecard,
        fullname,
        country,
        locality,
        firstdirection,
        seconddirection,
        postalcode,
        phonenumber,
      ],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            insertData(parseInt(idToTry) + 1);
          } else {
            console.log(err);
          }
        } else {
          res.send({ message: "SUCCESSFULLY SAVED" });
        }
      }
    );
  };

  insertData(1);
});

app.post("/api/get-purchase-history", (req, res) => {
  db.query("SELECT * FROM history", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send(result);
      } else {
        res.json({ message: "ERROR" });
      }
    }
  });
});

app.post("/api/verify-numbercard", (req, res) => {
  const numbercard = req.body.numberCardValue;

  const query = "SELECT COUNT(*) FROM userinfobuy WHERE numbercard = ?";

  db.query(query, [numbercard], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: `${result[0]["COUNT(*)"]}` });
    }
  });
});

app.post("/api/get-cards", (req, res) => {
  const username = req.body.username;

  const query = "SELECT * FROM userinfobuy WHERE username = ?";

  db.query(query, [username], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/delete-card", (req, res) => {
  const id = req.body.id;

  const query = "DELETE FROM userinfobuy WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'SUCCESS' });
  })
})

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});
