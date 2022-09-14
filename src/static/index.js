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

const getForm = function (employee) {
    return `
    
        <form id="form_${employee.id}" action="/employees/update?id=${employee.id}"
            method="post" style='display: none'>
            <input type="text" id="first_name" name="first_name" value="${employee.first_name}">
            <input type="text" id="last_name" name="last_name" value="${employee.last_name}">
            <input type="text" id="patronymic_name" name="patronymic_name" value="${employee.patronymic_name}">
            <input type="text" id="post" name="post" value="${employee.post}">
            <input type="number" id="salary" name="salary" value="${employee.salary}">    
        <button type="submit" form="form_${employee.id}" value="Submit">Submit</button>
        </form>
        <button class="btn" value="${employee.id}">+</button>`;
}

const _getHtml = function (employee) {
    if (employee.childs.length === 0) {
        return `
        <li>${employee.post} - ${employee.last_name} ${employee.first_name} ${employee.patronymic_name}</li>
            ${getForm(employee)}
        </li>`;
    }

    return `
      <li>
        <span  class="caret">${employee.post} - ${employee.last_name} ${employee.first_name} ${employee.patronymic_name}</span>
        ${getForm(employee)}
        <ul class="nested">
          ${employee.childs.map(getHtml).join('')}
        </ul>
      </li>`;
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


            const btn = document.getElementsByClassName('btn');
            for (let j = 0; j < btn.length; j++) {
                btn[j].addEventListener('click', () => {
                    const id = "form_" + btn[j].value;
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


        }
    });

