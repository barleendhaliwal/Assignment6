// import dotenv from 'dotenv';
// dotenv.config();
const baseUrl='http://localhost:9000/users'
enum Role { SUPERADMIN, ADMIN, SUBSCRIBER };
interface User {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: Role;
    address: string;
}
let crudObject: Crud<User> ;  //array of objects to be displayed on frontend

//DECORATOR FACTORY
function FormatDate() {
    return function (target: any, name: string, descriptor: PropertyDescriptor) {
        const dateTime = document.getElementById("dateTime")! as HTMLInputElement;
        dateTime.innerHTML = new Date().toLocaleString();
        setInterval(function () {
            dateTime.innerHTML = new Date().toLocaleString();
        }, 1000);
    }
}

//MODEL CLASS FOR USER ENTRY
class Crud<T> {

    items: Array<T>; // contains objects which will be displayed on front end

    constructor() {
        this.items = [];
    }
    @FormatDate()
    add(object: T): void {
        this.items.push(object)
    }

    update(id: string, object: T) {

        editUser(id, object).then((message) => {
            
            this.items=message.updatedMembers
            showTable()
        }).catch(()=> {alert("Unexpected Error Occured !")})
    }
    delete(id: string, object: T): void {

        //make api call to delete data 
        deleteUser(id).then((message) => {
            //delete data on front end

            this.items = message.members;
            showTable()
        }
        ).catch(()=> {alert("Unexpected Error Occured !")})

    }

}

//API CALLS ========================================================================================================================================

async function getUsers() {

    let response = await fetch(baseUrl);
    let users = await response.json() as User[];

    return users; // same as Promise.resolve(users)

}
async function deleteUser(id: string) {

    let response = await fetch(baseUrl+id, {
        method: 'DELETE'
    })
    let data = await response.json()
    return data;


}
async function editUser<T>(id: string, object: T) {

    let response = await fetch(baseUrl+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify(object)
    })
    let data = await response.json()
    return data;


}
//=====================================================================================================================================================



//MAKES THE CONTENT OF CURRENT ROW EDITABLE
function editRow(no: number) {
    let currentRow = document.getElementById("row" + no)!;
    currentRow.style.background = "yellow";

    //SHOW SAVE & CANCEL BUTTON
    let saveButton = document.getElementById("saveButtonRow" + no)!;
    let cancelButton = document.getElementById("cancelButtonRow" + no)!;
    let headerSave = document.getElementById("headerSave")!;
    let headerCancel = document.getElementById("headerCancel")!;


    saveButton.style.display = "";
    cancelButton.style.display = "";
    headerSave.style.display = "";
    headerCancel.style.display = "";

    //MAKE ROW EDITABLE 

    let rowId = document.getElementById("row" + no + "Id")!;
    let rowFname = document.getElementById("row" + no + "Fname")!;
    let rowMname = document.getElementById("row" + no + "Mname")!;
    let rowLname = document.getElementById("row" + no + "Lname")!;
    let rowEmail = document.getElementById("row" + no + "Email")!;
    let rowPhone = document.getElementById("row" + no + "Phone")!;
    let rowRole = document.getElementById("row" + no + "Role")!;
    let rowAddress = document.getElementById("row" + no + "Address")!;

    rowId.setAttribute("contenteditable", "true");
    rowFname.setAttribute("contenteditable", "true");
    rowMname.setAttribute("contenteditable", "true");
    rowLname.setAttribute("contenteditable", "true");
    rowEmail.setAttribute("contenteditable", "true");
    rowPhone.setAttribute("contenteditable", "true");
    rowRole.setAttribute("contenteditable", "true");
    rowAddress.setAttribute("contenteditable", "true");
}


function getCurrentRowData(no: number) {


    let rowId = document.getElementById("row" + no + "Id")!.innerHTML;
    let rowFname = document.getElementById("row" + no + "Fname")!.innerHTML;
    let rowMname = document.getElementById("row" + no + "Mname")!.innerHTML;
    let rowLname = document.getElementById("row" + no + "Lname")!.innerHTML;
    let rowEmail = document.getElementById("row" + no + "Email")!.innerHTML;
    let rowPhone = document.getElementById("row" + no + "Phone")!.innerHTML;
    let rowRole = document.getElementById("row" + no + "Role")!.innerHTML;
    let rowAddress = document.getElementById("row" + no + "Address")!.innerHTML;
    let r = -1;
    if (rowRole.toLowerCase() === "superadmin")
        r = 0;
    else if (rowRole.toLowerCase() === "admin")
        r = 1;
    else
        r = 2;

    let object: User = {
        id: rowId,
        firstName: rowFname,
        middleName: rowMname,
        lastName: rowLname,
        email: rowEmail,
        phoneNumber: rowPhone,
        role: r,
        address: rowAddress

    }

    return object;
}


function showTable() 
{

    var table: HTMLTableElement = <HTMLTableElement>document.createElement("table"); // TS knows that only a generic html element is returned by createElement, hence we need to specify
    table.className = 'table table-hover';

    // EXTRACT VALUE FOR HTML HEADER. 
    let tr = table.insertRow(-1);
    let headerElements = ["ID", "First Name", "Middle Name", "Last Name", "Email", "Phone Number", "Role", "Address"];

    for (let i = 0; i < headerElements.length; i++) {
        let th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = headerElements[i];
        tr.appendChild(th);
    }
    let thEdit = document.createElement("th");      // TABLE HEADER.
    thEdit.innerHTML = "Edit";
    tr.appendChild(thEdit);
    let thDelete = document.createElement("th");      // TABLE HEADER.
    thDelete.innerHTML = "Delete";
    tr.appendChild(thDelete);
    let thSave = document.createElement("th");      // TABLE HEADER. 
    thSave.innerHTML = "Save";
    tr.appendChild(thSave);
    let thCancel = document.createElement("th");      // TABLE HEADER. 
    thCancel.innerHTML = "Cancel";
    tr.appendChild(thCancel);


    thSave.style.display = "none";
    thCancel.style.display = "none";
    thSave.id = "headerSave";
    thCancel.id = "headerCancel";

    

    //populate from Crud object items data 

    for (let i = 0; i < crudObject.items.length; i++) {
       

        tr = table.insertRow(-1);

        tr.id = "row" + (i);

        let cell1 = tr.insertCell(-1);
        let id = crudObject.items[i].id;
        cell1.innerHTML = id;
        cell1.id = "row" + (i) + "Id";

        let cell2 = tr.insertCell(-1);
        let fname = crudObject.items[i].firstName;
        cell2.innerHTML = fname;
        cell2.id = "row" + (i) + "Fname";


        let cell3 = tr.insertCell(-1);
        let mname = crudObject.items[i].middleName;;
        cell3.innerHTML = mname;
        cell3.id = "row" + (i) + "Mname";

        let cell4 = tr.insertCell(-1);
        let lname = crudObject.items[i].lastName;
        cell4.innerHTML = lname;
        cell4.id = "row" + (i) + "Lname";

        let cell5 = tr.insertCell(-1);
        let email = crudObject.items[i].email;
        cell5.innerHTML = email;
        cell5.id = "row" + (i) + "Email";

        let cell6 = tr.insertCell(-1);
        let phone = crudObject.items[i].phoneNumber;
        cell6.innerHTML = phone;
        cell6.id = "row" + (i) + "Phone";

        let cell7 = tr.insertCell(-1);
        let role = Role[crudObject.items[i].role];
        cell7.innerHTML = role;
        cell7.id = "row" + (i) + "Role";

        let cell8 = tr.insertCell(-1);
        let add = crudObject.items[i].address;
        cell8.innerHTML = add;
        cell8.id = "row" + (i) + "Address";

        cell1.className = "editable";
        cell2.className = "editable";
        cell3.className = "editable";
        cell4.className = "editable";
        cell5.className = "editable";
        cell6.className = "editable";
        cell7.className = "editable";
        cell8.className = "editable";

        //BUTTONS ON EACH ROW

        //EDIT
        let cellForEditButton = tr.insertCell(-1);
        let editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.innerHTML = 'Edit';
        cellForEditButton.appendChild(editButton);
        editButton.addEventListener('click', function () { editRow(i) });

        //DELETE
        let cellForDeleteButton = tr.insertCell(-1);
        let deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.innerHTML = 'Delete';
        cellForDeleteButton.appendChild(deleteButton);
        deleteButton.addEventListener('click', function () {
            let deleteObject = getCurrentRowData(i);
            crudObject.delete(id, deleteObject);
        });

        //SAVE
        let cellForSaveButton = tr.insertCell(-1);
        let saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.innerHTML = 'Save';
        cellForSaveButton.className = 'hiddenElements';
        cellForSaveButton.id = 'saveButtonRow' + i;
        cellForSaveButton.appendChild(saveButton);
        cellForSaveButton.style.display = "none";
        saveButton.addEventListener('click', function () {

            let updatedRowObject = getCurrentRowData(i);
            crudObject.update(id, updatedRowObject);

            let saveButton = document.getElementById("saveButtonRow" + i)!;
            let cancelButton = document.getElementById("cancelButtonRow" + i)!;
            let headerSave = document.getElementById("headerSave")!;
            let headerCancel = document.getElementById("headerCancel")!;

            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            headerSave.style.display = "none";
            headerCancel.style.display = "none";
        });

        //CANCEL
        var cellForCancelButton = tr.insertCell(-1);
        var cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.innerHTML = 'Cancel';
        cellForCancelButton.className = 'hiddenElements';
        cellForCancelButton.id = 'cancelButtonRow' + (i);
        cellForCancelButton.appendChild(cancelButton);
        cellForCancelButton.style.display = "none";
        cancelButton.addEventListener('click', function () { showTable(); });


    }
   
    let divContainer = document.getElementById("showData")!;
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
    let loadButton = <HTMLButtonElement>document.getElementById("showDataButton")!;
    loadButton.value = "Refresh";


}


function main() {

    // console.log(process.env.BASE_URL)
    const result = document.getElementById('showData')!
    getUsers()
        .then(usersArray => {

           
            crudObject = new Crud<User>(); //creating object of crud with generic type of user
            usersArray.forEach(function (object: User) { crudObject.add(object) }) //pushing objects obtained via api into array
            showTable();
            // Promise.resolve();
            
        })
        .catch(()=> {alert("Unexpected Error Occured !")})
        
}