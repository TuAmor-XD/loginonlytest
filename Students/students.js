async function addStudent() {
  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const email = document.getElementById("email").value;
  const classroom = document.getElementById("classroom").value;
  const message = document.getElementById("message");

  if (!fname || !lname || !email || !classroom) {
    message.innerText = "Please fill all fields";
    return;
  }

  const response = await fetch("http://localhost:3000/student", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      firstName: fname,
      lastName: lname,
      email,
      classroom
    })
  });

  const data = await response.json();

  message.innerText = "Student added with ID: " + data.studentID;
}

async function viewStudent() {
  const id = document.getElementById("studentID").value;
  const message = document.getElementById("message");

  const response = await fetch(`http://localhost:3000/student/${id}`);
  const data = await response.json();

  if (!response.ok) {
    message.innerText = "Student not found";
    return;
  }

  message.innerText =
    `Name: ${data.fname} ${data.lname}
     Email: ${data.email}
     Classroom: ${data.classroom}`;
}

