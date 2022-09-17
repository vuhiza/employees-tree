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
<button class="edit_btn fa fa-pencil fa-lg"  aria-hidden="true"  value="${employee.id}"></button>

    <form id="edit_form_${employee.id}" target="dummyframe" action="/employees/update?id=${employee.id}"
            method="post" style='display: none'>
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
        <button class="single_create_btn fa fa-plus fa-lg" id="single_create_btn" aria-hidden="true"  value="">Add new employee</button>

        <form id="single_create_form" target="dummyframe" action="/employees"
            method="post" style='display: none'>
            <input type="text" id="first_name" name="first_name" value="New first_name">
            <input type="text" id="last_name" name="last_name" value="New last_name">
            <input type="text" id="patronymic_name" name="patronymic_name" value="New patronymic_name">
            <input type="text" id="last_name" name="post" hidden="true" value="chief">
            <input type="number" id="salary" name="salary" value="1500">    
        <button type="submit" form="single_create_form" value="Submit">Submit</button>
        </form>
        `;
    if (employee) {
        resultText = `

        <button class="create_btn fa fa-plus fa-lg"  aria-hidden="true"  value="${employee.id}"></button>
        <form id="create_form_${employee.id}" target="dummyframe" action="/employees"
            method="post" style='display: none'>
            <input type="text" id="first_name" name="first_name" value="New first_name">
            <input type="text" id="last_name" name="last_name" value="New last_name">
            <input type="text" id="patronymic_name" name="patronymic_name" value="New patronymic_name">
            <input type="text" id="post" name="post" value="programmer">
            <input type="text" id="chief_id" name="chief_id" hidden='true' value="${employee.id}">
            <input type="number" id="salary" name="salary" value="1500">    
        <button type="submit" form="create_form_${employee.id}" value="Submit">Submit</button>
        </form>
        `;
    }

    return resultText;
}

const _getHtml = function (employee) {
    var resultText = `<li>
        <span  class="caret">${employee.post} - ${employee.last_name} ${employee.first_name} ${employee.patronymic_name}</span>
        ${getEditForm(employee)} ${getCreateForm(employee)}
        <ul class="nested">
          ${employee.childs.map(getHtml).join('')}
        </ul>
      </li>`;

    if (employee.childs.length === 0) {
        resultText = `
        <li>${employee.post} - ${employee.last_name} ${employee.first_name} ${employee.patronymic_name} ${getEditForm(employee)} ${getCreateForm(employee)}</li>
            
        </li>`;
    }

    return resultText;

}

const getHtml = function (employee) {
    return `
        <ul id="myUL">${_getHtml(employee)}</ul>
`;
}


getJSON('http://localhost:8080/employees/tree',
    function (err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            var rHtml = "";
            rHtml += getCreateForm(null);
            rHtml += data.map(getHtml).join('');
            document.body.innerHTML = rHtml;


            var toggler = document.getElementsByClassName("caret");
            var i;

            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function () {
                    this.parentElement.querySelector(".nested").classList.toggle("active");
                    this.classList.toggle("caret-down");
                });
            }

            var btn = document.getElementsByClassName('edit_btn');
            for (let j = 0; j < btn.length; j++) {
                btn[j].addEventListener('click', () => {
                    const id = "edit_form_" + btn[j].value;
                    const form = document.getElementById(id);

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
