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


const _getHtml = function (employee) {
    if (employee.childs.length === 0) {
        return `
        <li>${employee.last_name} ${employee.first_name}</li>`;
    }

    return `
        <li>
        <span  class="caret">${employee.last_name} ${employee.first_name}</span>
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
        }
    });

