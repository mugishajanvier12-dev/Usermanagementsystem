const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
 
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};
app.get('/',(req,res) => {
  res.send("Hello World")
})
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
                 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating user', error: err.message });
        }
        if (result) {

          
          console.log("User Inserted Successfully");
          return res.status(200).json({ message: "User Inserted Successfully", result })
          
        }
        
          // // Return created user without password
          // db.query(
          //   'SELECT id, username, email, created_at FROM users WHERE id = ?',
          //   [result.insertId],
          //   (err, rows) => {
          //     if (err) {
          //       return res.status(500).json({ message: 'Error retrieving created user', error: err.message });
          //     }
              
          //     res.status(201).json(rows[0]);
          //   }
          // );
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'username  and password are required' });
    }
    
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const user = results[0];      
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.status(200).json({ message: 'Login successful', token });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.get('/api/users', authenticateToken, (req, res) => {
  try {
    db.query(
      'SELECT id, username, email, created_at, updated_at FROM users',
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        res.status(200).json(results);
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.get('/api/getusers', (req, res) => {
  try { 
    db.query('SELECT * FROM users', (err, result) => {
      if (err) {
        res.json({ message: 'Error Fetching Users', error: error.message })
      }
      else { 
        res.json({message: 'Users successfully fetched', result})
      }
    })
  } catch (err) {
    res.json({ message: 'Internal Error', error: err.message})
  }
})
app.get('/api/users/:id', authenticateToken, (req, res) => {
  try {
    db.query(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
      [req.params.id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(results[0]);
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = parseInt(req.params.id);
    
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied: You can only update your own account' });
    }
    
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const updates = [];
      const values = [];
      
      if (username) {
        updates.push('username = ?');
        values.push(username);
      }
      
      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }
      
      values.push(userId);
      
      const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      
      db.query(updateQuery, values, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating user', error: err.message });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found or no changes made' });
        }
        
        db.query(
          'SELECT id, username, email, create_at, update_at FROM users WHERE id = ?',
          [userId],
          (err, rows) => {
            if (err) {
              return res.status(500).json({ message: 'Error retrieving updated user', error: err.message });
            }
            
            res.status(200).json(rows[0]);
          }
        );
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.delete('/api/users/:id', authenticateToken, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied: You can only delete your own account' });
    }
    
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting user', error: err.message });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/home', (req, res) => {
  res.json({ message: 'Welcome to our home page api'})
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






