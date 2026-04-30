async function addTeacher() {
  const name = document.getElementById("tname").value;
  const email = document.getElementById("temail").value;
  const homeroom = document.getElementById("homeroom").value;
  const message = document.getElementById("message");

  if (!name || !email || !homeroom) {
    message.innerText = "Please fill all fields";
    return;
  }

  const response = await fetch("http://localhost:3000/teacher", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name,
      email,
      homeroom
    })
  });

  const data = await response.json();

  message.innerText = "Teacher added with ID: " + data.teacherID;
}

async function viewTeacher() {
  const id = document.getElementById("teacherID").value;
  const message = document.getElementById("message");

  const response = await fetch(`http://localhost:3000/teacher/${id}`);
  const data = await response.json();

  if (!response.ok) {
    message.innerText = "Teacher not found";
    return;
  }

  message.innerText =
    `Name: ${data.name}
     Email: ${data.email}
     Homeroom: ${data.homeroom}`;
}
