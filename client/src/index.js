const form = document.querySelector('form');
const updateButton = document.querySelector('#update-button');
const output = document.querySelector('#output');

const generateId = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomLetter = alphabet[randomIndex];
    result += randomLetter;
  }

  return result;
};

const deleteStudent = id => {
  const studentToDelete = { id };

  fetch('/students', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentToDelete),
  })
    .then(res => res.json())
    .then(data => {
      printData(data);
    })
    .catch(error => {
      console.error('Error deleting student:', error);
    });
};

const printData = data => {
  let html = '';
  data.forEach(student => {
    html += `<tr>
        <td hidden="hidden">${student.id}</td>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.faculty}</td>
        <td>${student.group}</td>
        <td>${student.scholarship}</td>
        <td>
          <button
          class="btn btn-danger delete-btn"
          data-id="${student.id}"
          >
          Delete
          </button>
          <button class="btn btn-primary my-modal-btn" type="button">Edit</button>
        </td>
      </tr>`;
  });
  output.innerHTML = html;
  form.reset();

  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      deleteStudent(id);
    });
  });

  const myModal = new bootstrap.Modal(document.querySelector('#myModal'));
  const editButtons = document.querySelectorAll('.my-modal-btn');
  const saveChangesButton = document.querySelector('#save-changes-button');

  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const [id, firstName, lastName, faculty, group, scholarship] =
        button.parentElement.parentElement.children;

      const editForm = document.querySelector('#editForm');
      const [
        editId,
        editFirstName,
        editLastName,
        editFaculty,
        editGroup,
        editScholarship,
      ] = editForm.elements;

      editId.value = id.innerText;
      editFirstName.value = firstName.innerText;
      editLastName.value = lastName.innerText;
      editFaculty.value = faculty.innerText;
      editGroup.value = group.innerText;
      editScholarship.value = scholarship.innerText;

      myModal.show();

      saveChangesButton.addEventListener('click', () => {
        const updatedStudent = {
          id: editId.value,
          firstName: editFirstName.value,
          lastName: editLastName.value,
          faculty: editFaculty.value,
          group: editGroup.value,
          scholarship: editScholarship.value,
        };

        fetch('/students', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedStudent),
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            printData(data);
          })
          .catch(error => {
            console.error('Error updating student:', error);
          });
        myModal.hide();
      });
    });
  });
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const { firstName, lastName, faculty, group, scholarship } =
    Object.fromEntries(formData);
  const isEmptyFields = [firstName, lastName, faculty, group, scholarship].some(
    field => field.trim() === ''
  );

  if (isEmptyFields) return;

  const student = {
    id: generateId(),
    firstName: firstName,
    lastName: lastName,
    faculty: faculty,
    group: group,
    scholarship: scholarship,
  };

  fetch('/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  })
    .then(res => res.json())
    .then(data => {
      printData(data);
    })
    .catch(error => {
      console.error('Error sending data to server:', error);
    });
});

updateButton.addEventListener('click', () => {
  fetch('/students', {
    method: 'GET',
  })
    .then(res => res.json())
    .then(data => {
      printData(data);
    })
    .catch(error => {
      console.error('Error retrieving data from server:', error);
    });
});
