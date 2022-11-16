const myTable = document.querySelector(".myTable");
const tbody = document.querySelector(".tbody");
const displayUserDetails = document.querySelector(".displayUserDetails");
const noData = document.querySelector(".noData");
const errorMessage = document.querySelector(".errorMessage");
// ---------------inputField selectors----------------

const inputName = document.querySelector(".inputName");
const inputBirthDate = document.querySelector(".inputBirthDate");
const inputAadhar = document.querySelector(".inputAadhar");
const inputMobileNum = document.querySelector(".inputMobileNum");
const aadharCheckInput = document.querySelector(".aadharCheckInput");

// --------------btn selectors----------------

const addNewPersonBtn = document.querySelector(".addNewPersonBtn");
const retrieveInfoBtn = document.querySelector(".retrieveInfoBtn");
const addRowBtn = document.querySelector(".addRowBtn");
const findBtn = document.querySelector(".findBtn");

let myUser = [];

// ----------------age caluculation------------
function calculateAge() {
  return (
    new Date().getFullYear() - new Date(`${inputBirthDate.value}`).getFullYear()
  );
}

// ------------------creating user--------------
function createUser() {
  let user = {
    Name: inputName.value,
    "Date of Birth": inputBirthDate.value,
    "Aadhar Number": inputAadhar.value,
    "Mobile Number": inputMobileNum.value,
    Age:
      new Date().getFullYear() -
      new Date(`${inputBirthDate.value}`).getFullYear(),
  };
  myUser.push(user);
}

// -----------------making input fields empty---------------
function resetDefault() {
  inputName.value = "";
  inputBirthDate.value = "";
  inputAadhar.value = "";
  inputMobileNum.value = "";
}

function createRow() {
  // --------------validations--------------

  if (inputName.value == "" || inputName.value == null) {
    errorMessage.innerHTML = "Please Enter Name";
    setTimeout(() => {
      errorMessage.innerHTML = "";
    }, 3000);
    return false;
  } else if (inputAadhar.value.length < 12 || inputAadhar.value.length > 12) {
    errorMessage.innerHTML = "Aadhar Number Should be of 12 digits";
    setTimeout(() => {
      errorMessage.innerHTML = "";
    }, 3000);
    return false;
  } else if (
    inputMobileNum.value.length < 10 ||
    inputMobileNum.value.length > 10
  ) {
    errorMessage.innerHTML = "Mobile Number should be 10 digits";
    setTimeout(() => {
      errorMessage.innerHTML = "";
    }, 3000);
    return false;
  }

  let myAge = calculateAge();

//   -----------------creating row---------------

  let rowTemplate = `
    <tr>
        <td>${inputName.value}</td>
        <td>${inputBirthDate.value}</td>
        <td>${inputAadhar.value}</td>
        <td>${inputMobileNum.value}</td>
        <td class="Age">${myAge}</td>
        <td>
            <button class="save saveBtn" id="${inputMobileNum.value}"> Save</button>
            <button class="delBtn" id="${inputAadhar.value}"> Delete</button>
        </td>
  </tr>
    `;
  tbody.innerHTML += rowTemplate;

  createUser();
  resetDefault();
}

// --------------saving user details to local storage-------------

function saveUser(e) {
  if (e.target.classList.contains("saveBtn")) {
    let storeUser = myUser.filter((item) => {
      return e.target.id == item["Mobile Number"];
    });
    console.log(storeUser);

    let storedUser = JSON.parse(localStorage.getItem("user")) ?? [];
    storedUser.push(...storeUser);

    localStorage.setItem("user", JSON.stringify(storedUser));
  }
  e.target.classList.remove("saveBtn");
}

// ----------deleting row and specific details from local storage------------

function delUser(e) {
  if (e.target.classList.contains("delBtn")) {
    console.log("del");
    e.target.closest("tr").remove();

    let storedData = JSON.parse(localStorage.getItem("user"));
    console.log(storedData);

    let filterDel = storedData.filter((item) => {
      return e.target.id !== item["Aadhar Number"];
    });
    localStorage.setItem("user", JSON.stringify(filterDel));
    console.log(filterDel);
  }
}

// --------------------switching tabs--------------

function handleTabs(e) {
  if (e.target.classList.contains("addNewPersonBtn")) {
    document.querySelector(".retrieveInfoSection").style.display = "none";
    document.querySelector(".addNewPersonSection").style.display = "block";
  } else {
    document.querySelector(".retrieveInfoSection").style.display = "block";
    document.querySelector(".addNewPersonSection").style.display = "none";
  }
}

// --------------------checking user match--------------------

function matchUser() {
  let storedUser = JSON.parse(localStorage.getItem("user"));
  console.log(storedUser);

  for (let i = 0; i < storedUser.length; i++) {
    if (aadharCheckInput.value !== storedUser[i]["Aadhar Number"]) {
      noData.innerHTML = "No Data";
      displayUserDetails.innerHTML = "";
    }
  }

  for (let i = 0; i < storedUser.length; i++) {
    if (aadharCheckInput.value == storedUser[i]["Aadhar Number"]) {
      displayUserDetails.innerHTML = `
            <div class="userDetails">
                <p>Name:${storedUser[i]["Name"]}</p>
                <p>DOB:${storedUser[i]["Date of Birth"]}</p>
                <p>Aadhar Number:${storedUser[i]["Aadhar Number"]}</p>
                <p>Mobile Number:${storedUser[i]["Mobile Number"]}</p>
                <p>Age:${storedUser[i]["Age"]}</p>
            </div>
            `;
      noData.innerHTML = "";
    }
  }
}

addRowBtn.addEventListener("click", createRow);
myTable.addEventListener("click", saveUser);
myTable.addEventListener("click", delUser);
addNewPersonBtn.addEventListener("click", handleTabs);
retrieveInfoBtn.addEventListener("click", handleTabs);
findBtn.addEventListener("click", matchUser);
