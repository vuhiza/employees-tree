const getJSON = function (url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        let status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};


const getEditForm = function (employee) {
    return `
    <button class="edit_btn btn my-2 my-sm-0" aria-hidden="true" value="${employee.id}">Edit</button>
                                            
    <form id="edit_form_${employee.id}" target="dummyframe" action="/employees/update?id=${employee.id}"
            method="post" style="display: none" ">
      <div class="mb-3">
        <label for="first_name" class="form-label">First name</label>
        <input type="text" id="first_name" name="first_name" value="${employee.first_name}">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Last name</label>
        <input type="text" id="last_name" name="last_name" value="${employee.last_name}">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Patronymic name</label>
        <input type="text" id="patronymic_name" name="patronymic_name" value="${employee.patronymic_name}">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Post of employeer</label>
        <input type="text" id="post" name="post" value="${employee.post}">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Salary</label>
        <input type="number" id="salary" name="salary" value="${employee.salary}">
      </div>
      <button type="submit" form="edit_form_${employee.id}" class="btn btn-primary">Submit</button>
    </form>
        `;
}

const getCreateForm = function (employee = null) {
    var resultText = `
        <button id="single_create_btn" class="single_create_btn btn my-2 my-sm-0" aria-hidden="true">Add</button>
                                            
    <form id="single_create_form" target="dummyframe" action="/employees"
            method="post" style="display: none" ">
      <div class="mb-3">
        <label for="first_name" class="form-label">First name</label>
        <input type="text" id="first_name" name="first_name" value="First name">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Last name</label>
        <input type="text" id="last_name" name="last_name" value="Last name">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Patronymic name</label>
        <input type="text" id="patronymic_name" name="patronymic_name" value="Patronymic name">
      </div>
      <input type="text" id="last_name" name="post" hidden="true" value="chief">
      <div class="mb-3">
        <label for="first_name" class="form-label">Salary</label>
        <input type="number" id="salary" name="salary" value="1500">
      </div>
      <button type="submit" form="single_create_form" class="btn btn-primary">Submit</button>
    </form>
        `;
    if (employee) {
        resultText = `
        <button class="create_btn btn my-2 my-sm-0" aria-hidden="true" value="${employee.id}">Add</button>
                                            
    <form id="create_form_${employee.id}" target="dummyframe" action="/employees"
            method="post" style="display: none" ">
      <div class="mb-3">
        <label for="first_name" class="form-label">First name</label>
        <input type="text" id="first_name" name="first_name" value="First name">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Last name</label>
        <input type="text" id="last_name" name="last_name" value="Last name">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Patronymic name</label>
        <input type="text" id="patronymic_name" name="patronymic_name" value="Patronymic name">
      </div>
      <div class="mb-3">
        <label for="first_name" class="form-label">Post of employeer</label>
        <input type="text" id="post" name="post" value="programmer">
      </div>
            <input type="text" id="chief_id" name="chief_id" hidden='true' value="${employee.id}">
      <div class="mb-3">
        <label for="first_name" class="form-label">Salary</label>
        <input type="number" id="salary" name="salary" value="1500">
      </div>
      <button type="submit" form="create_form_${employee.id}" class="btn btn-primary">Submit</button>
    </form>

        `;
    }

    return resultText;
}

const _getHtml = function (employee) {
    var resultText =
        `<li>
            <span class="fas fa-angle-right rotate rotates_block"> ${employee.post} - ${employee.last_name} ${employee.first_name} ${employee.patronymic_name}</span>
            ${getEditForm(employee)} ${getCreateForm(employee)}
        <ul class="nested">
          ${employee.childs.map(_getHtml).join('')}
        </ul>
      </li>`;

    if (employee.childs.length === 0) {
        resultText = `
        <li class="py-1">
            <i class="mr-1"></i>${employee.post} - ${employee.last_name} ${employee.first_name}</i>${getEditForm(employee)} ${getCreateForm(employee)}-
        </li>

            `;
    }

    return resultText;

}

const getHtml = function (employee) {
    return `
<iframe name="dummyframe"
        id="dummyframe" width="0" height="0" border="0" style="display: none;"></iframe>
    <div class="container pt-4">
        <div class="row">
            <div class="card">
                <div class="card-header card-header-left">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="pl-4">Employees list</h5> ${getCreateForm(null)}
                    </div>
                </div>
                <ul class="mb-1 pl-3 pb-2">
                ${employee.map(_getHtml).join('')}
                </ul>
             </div>
        </div>
    </div>
        
`;
}


getJSON('http://localhost:8080/employees/tree',
    function (err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            var rHtml = "";
            rHtml += getHtml(data);
            document.body.innerHTML = rHtml;


            var toggler = document.getElementsByClassName("rotates_block");
            var i;

            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function () {
                    this.parentElement.querySelector(".nested").classList.toggle("active");
                });
            }

            var edit_btn = document.getElementsByClassName('edit_btn');
            for (let j = 0; j < edit_btn.length; j++) {
                edit_btn[j].addEventListener('click', () => {
                    const id = "edit_form_" + edit_btn[j].value;
                    const form = document.getElementById(id);
                    form.onsubmit = function () {
                        location.reload(true);
                    }


                    if (form.style.display === 'none') {
                        // 👇️ this SHOWS the form
                        form.style.display = 'block';
                    } else {
                        // 👇️ this HIDES the form
                        form.style.display = 'none';
                    }
                });
            }

            var btn = document.getElementsByClassName('create_btn');
            for (let j = 0; j < btn.length; j++) {
                btn[j].addEventListener('click', () => {
                    const id = "create_form_" + btn[j].value;
                    const form = document.getElementById(id);
                    form.onsubmit = function () {
                        location.reload(true);
                    }


                    if (form.style.display === 'none') {
                        // 👇️ this SHOWS the form
                        form.style.display = 'block';
                    } else {
                        // 👇️ this HIDES the form
                        form.style.display = 'none';
                    }
                });
            }

            document.getElementById('single_create_btn').addEventListener('click', () => {
                const id = "single_create_form";
                const form = document.getElementById(id);

                form.onsubmit = function () {
                    location.reload(true);
                }

                if (form.style.display === 'none') {
                    // 👇️ this SHOWS the form
                    form.style.display = 'block';
                } else {
                    // 👇️ this HIDES the form
                    form.style.display = 'none';
                }
            });

        }
    });
