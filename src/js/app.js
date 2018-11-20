import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseProgram} from './code-analyzer';

let arr;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        arr = parseProgram(parsedCode);
        CreateTable();
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

    });
});

function CreateTable() {
    let col = [];
    for (let i = 0; i < arr.length; i++) {
        for (let k in arr[i]) {
            if (col.indexOf(k) === -1){col.push(k);}
        }
    }
    let table = document.createElement('table');
    let tr = table.insertRow(-1);
    for (let i = 0; i < col.length; i++) {
        let th = document.createElement('th');
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    FillTable(tr,col,table);
    let divContainer = document.getElementById('showTable');
    divContainer.innerHTML = '';
    divContainer.appendChild(table);
}

function FillTable(tr,col,table) {
    for (let i = 0; i < arr.length; i++) {
        tr = table.insertRow(-1);
        for (let j = 0; j < col.length; j++) {
            let tabCell = tr.insertCell(-1);
            tabCell.innerHTML = arr[i][col[j]];
        }
    }
}