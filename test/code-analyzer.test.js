import assert from 'assert';
import {parseCode , parseProgram} from '../src/js/code-analyzer';


describe('Basic tests',() => {
    it('check empty program', () => {
        assert(JSON.stringify(parseProgram(parseCode(''))) === '[]');
    });

    it('check variable declaration', () => {
        assert(JSON.stringify(parseProgram(parseCode('let x;'))) ===
            '[{"line":1,"type":"variable declaration","name":"x","condition":"","value":null}]');
    });

    it('check FunctionDeclaration', () => {
        assert(JSON.stringify(parseProgram(parseCode('function a(b){return b+1;}'))) ===
            '[{"line":1,"type":"FunctionDeclaration","name":"a","condition":"","value":""}' +
            ',{"line":1,"type":"Identifier","name":"b","condition":"","value":""},' +
            '{"line":1,"type":"ReturnStatement","name":"","condition":"","value":"b+1"}]');
    });
});

describe('Some expressions test',() => {
    it('check Identifier & AssignmentExpression & variable declaration & ReturnStatement & UpdaseExpression', () => {
        assert(JSON.stringify(parseProgram(parseCode('function check(a,b){\n' +
            'a=1;\n' +
            'b=a;\n' +
            'let c = 4;\n' +
            'b = c+(2*3);\n' +
            'return a--;\n' +
            '}'))) ===
            '[{"line":1,"type":"FunctionDeclaration","name":"check","condition":"","value":""},' +
            '{"line":1,"type":"Identifier","name":"a","condition":"","value":""},' +
            '{"line":1,"type":"Identifier","name":"b","condition":"","value":""},' +
            '{"line":2,"type":"AssignmentExpression","name":"a","condition":"","value":1},' +
            '{"line":3,"type":"AssignmentExpression","name":"b","condition":"","value":"a"},' +
            '{"line":4,"type":"variable declaration","name":"c","condition":"","value":4},' +
            '{"line":5,"type":"AssignmentExpression","name":"b","condition":"","value":"c+2*3"},' +
            '{"line":6,"type":"ReturnStatement","name":"","condition":"","value":"a--"}]');
    });
});

describe('Expressions tests',() => {
    it('check AssignmentExpression', () => {
        assert(JSON.stringify(parseProgram(parseCode('a=a+1;'))) ===
            '[{"line":1,"type":"AssignmentExpression","name":"a","condition":"","value":"a+1"}]');
    });

    it('check prefixUpdateExpression', () => {
        assert(JSON.stringify(parseProgram(parseCode('function a(b){return ++b;}'))) ===
            '[{"line":1,"type":"FunctionDeclaration","name":"a","condition":"","value":""},' +
            '{"line":1,"type":"Identifier","name":"b","condition":"","value":""},' +
            '{"line":1,"type":"ReturnStatement","name":"","condition":"","value":"++b"}]');
    });
});

describe('If & Else & IfElse tests',() => {
    it('check IfStatement', () => {
        assert(JSON.stringify(parseProgram(parseCode('if(x<mid[a]){}'))) ===
            '[{"line":1,"type":"IfStatement","name":"","condition":"x<mid[a]","value":""}]');
    });

    it('check IfStatement & ElseIfStatement', () => {
        assert(JSON.stringify(parseProgram(parseCode('if(x<5){} else if(x<3){}'))) ===
            '[{"line":1,"type":"IfStatement","name":"","condition":"x<5","value":""},' +
            '{"line":1,"type":"IfStatement","name":"","condition":"x<3","value":""}]');
    });

    it('check IfStatement & ElseIfStatement & ElseStatement', () => {
        assert(JSON.stringify(parseProgram(parseCode('if(x<5){} else if(x<3){} else{}'))) ===
            '[{"line":1,"type":"IfStatement","name":"","condition":"x<5","value":""},' +
            '{"line":1,"type":"IfStatement","name":"","condition":"x<3","value":""},' +
            '{"line":1,"type":"ElseStatement","name":"","condition":"","value":""}]');
    });
});


describe('while & for tests',() => {
    it('check WhileStatement', () => {
        assert(JSON.stringify(parseProgram(parseCode('while(i<3){i=i+1;}'))) ===
            '[{"line":1,"type":"WhileStatement","name":"","condition":"i<3","value":""},' +
            '{"line":1,"type":"AssignmentExpression","name":"i","condition":"","value":"i+1"}]');
    });

    it('check ForStatement', () => {
        assert(JSON.stringify(parseProgram(parseCode('for(let i =0 ; i<3 ;i++){}'))) ===
            '[{"line":1,"type":"ForStatement","name":"","condition":"i<3","value":""},' +
            '{"line":1,"type":"variable declaration","name":"i","condition":"","value":0}]');
    });
});

describe('Expressions tests',() => {
    it('check UnaryExpression & BlockStatement & LogicalExpression', () => {
        assert(JSON.stringify(parseProgram(parseCode('function a(){if(a===3 && true){return -1;}}'))) ===
            '[{"line":1,"type":"FunctionDeclaration","name":"a","condition":"","value":""},' +
            '{"line":1,"type":"IfStatement","name":"","condition":"a===3 && true","value":""},' +
            '{"line":1,"type":"ReturnStatement","name":"","condition":"","value":"-1"}]');
    });
});