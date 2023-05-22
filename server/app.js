const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

let students = [
  {
    id: 'hhyzf',
    firstName: 'Daniil',
    lastName: 'Metelia',
    faculty: 'FITIS',
    group: 'PZ-2104',
    scholarship: 0,
  },
  {
    id: 'pppzz',
    firstName: 'John',
    lastName: 'Doe',
    faculty: 'FITIS',
    group: 'PZ-2104',
    scholarship: 1000,
  },
];

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.status(404).send('Page not found');
    } else {
      res.status(200).type('text/html').send(data);
    }
  });
});

app.get('/students', (req, res) => {
  res.status(200).json(students);
});

app.post('/students', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const newStudent = JSON.parse(body);
    students.push(newStudent);
    res.status(200).json(students);
  });
});

app.delete('/students', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const studentToDelete = JSON.parse(body);
    students = students.filter(student => student.id !== studentToDelete.id);
    res.status(200).json(students);
  });
});

app.put('/students', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const updatedStudent = JSON.parse(body);
    const index = students.findIndex(
      student => student.id === updatedStudent.id
    );
    students[index] = updatedStudent;
    res.status(200).json(students);
  });
});

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
