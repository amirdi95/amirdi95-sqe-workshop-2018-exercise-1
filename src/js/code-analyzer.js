import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse , {loc : true});
};

export {parseCode};
export {parseProgram};

function Line(line, type, name,condition, value) {
    this.line = line;
    this.type = type;
    this.name = name;
    this.condition = condition;
    this.value = value;
}

let main_handler = {'FunctionDeclaration':parseFunctionDeclaration,
    'VariableDeclaration':parseVariableDeclaration ,
    'WhileStatement' :parseWhileStatement,
    'ForStatement':parseForStatement,
    'IfStatement':parseIfStatement,
    'ReturnStatement':parseReturnStatement,
    'ExpressionStatement':parseExpression,
    'AssignmentExpression':parseAssignmentExpression,
    'BinaryExpression':parseBinaryExpression,
    'LogicalExpression' : parseLogicalExpression,
    'UnaryExpression' :parseUnaryExpression ,
    'MemberExpression':parseMemberExpression,
    'Literal':parseLiteral,
    'Identifier':parseIdentifier,
    'UpdateExpression':parseUpdateExpression,
    'BlockStatement':parseBlockStatement};

function parseProgram(program){
    return parseBody(program.body,[]);
}

function parseBody(body,arr) {
    let handler;
    for (let i = 0; i < body.length; i++) {
        handler = main_handler[body[i].type];
        arr.concat(handler(body[i],arr));
    }
    return arr;
}

function parseFunctionDeclaration (funDec , arr) {
    let l = new Line(funDec.loc.start.line , funDec.type ,funDec.id.name, '','' );
    arr.push(l);
    arr.concat(parseParams(funDec.params ,arr));
    arr.concat(parseFunctionBody(funDec.body.body ,arr));
    return arr;
}

function parseParams(params , arr) {
    for(let i = 0 ; i< params.length ; i++){
        let l = new Line(params[i].loc.start.line , params[i].type ,params[i].name ,'' , '');
        arr.push(l);
    }
    return arr;
}

function parseFunctionBody(body , arr) {
    for (let i=0 ; i<body.length ; i++){
        arr.concat(main_handler[body[i].type](body[i], arr));
    }
    return arr;
}

function parseVariableDeclaration(body , arr) {
    let b = body.declarations;
    for(let i = 0; i< b.length;i++) {
        let init=null;
        if(!(b[i].init===null)){
            init = main_handler[b[i].init.type](b[i].init);
        }
        let l = new Line(b[i].loc.start.line, 'variable declaration', b[i].id.name, '', init);
        arr.push(l);
    }
    return arr;
}

function parseWhileStatement(whileStat , arr) {
    let test = main_handler[whileStat.test.type](whileStat.test) ;
    let l = new Line(whileStat.loc.start.line ,whileStat.type ,'',test ,'');
    arr.push(l);
    arr.concat(main_handler[whileStat.body.type](whileStat.body,arr));
    return arr;
}

function parseIfStatement(ifStat ,arr){
    let test = main_handler[ifStat.test.type](ifStat.test);
    let l = new Line(ifStat.loc.start.line ,ifStat.type ,'' ,test ,'');
    arr.push(l);
    arr.concat(main_handler[ifStat.consequent.type](ifStat.consequent,arr));
    if(!(ifStat.alternate===null)){
        if(ifStat.alternate.type==='BlockStatement'){
            arr.push(new Line(ifStat.alternate.loc.start.line ,'ElseStatement' ,'' ,'' ,''));
        }
        arr.concat(main_handler[ifStat.alternate.type](ifStat.alternate,arr));}
    return arr;
}

function parseBlockStatement(body,arr) {
    arr.concat(parseBody(body.body , arr));
    return arr;
}

function parseForStatement(forStat,arr) {
    let test = main_handler[forStat.test.type](forStat.test);
    let l = new Line(forStat.loc.start.line,forStat.type,'',test,'');
    arr.push(l);
    arr.concat(main_handler[forStat.init.type](forStat.init,arr));
    arr.concat(main_handler[forStat.update.type](forStat.update,arr));
    arr.concat(parseBody(forStat.body.body,arr));
    return arr;
}

function parseReturnStatement(returnStat,arr) {
    let Val = main_handler[returnStat.argument.type](returnStat.argument);
    let l = new Line(returnStat.loc.start.line , returnStat.type ,'' ,'' , Val);
    arr.push(l);
    return arr;
}

function parseExpression(expressionStat,arr) {
    let Val ;
    Val = main_handler[expressionStat.expression.type](expressionStat.expression,arr);
    return Val;
}

function parseBinaryExpression(body) {
    let left= main_handler[body.left.type](body.left);
    let right = main_handler[body.right.type](body.right);
    return left.toString()+body.operator.toString()+right.toString();
}

function parseAssignmentExpression(body,arr) {
    let left = main_handler[body.left.type](body.left);
    let right = main_handler[body.right.type](body.right);
    let l = new Line(body.loc.start.line,body.type, left, '', right);
    arr.push(l);
    return arr;
}

function parseLogicalExpression(body) {
    let left= main_handler[body.left.type](body.left);
    let right = main_handler[body.right.type](body.right);
    return left.toString()+' '+body.operator.toString()+' '+right.toString();
}

function parseUnaryExpression(body) {
    return body.operator+main_handler[body.argument.type](body.argument);
}

function parseMemberExpression(body){
    let obj = main_handler[body.object.type](body.object);
    let prop = main_handler[body.property.type](body.property);
    return obj+'['+prop+']';
}

function parseLiteral(body){
    return body.value;
}

function parseIdentifier(body){
    return body.name;
}

function parseUpdateExpression(body){
    return (body.prefix? body.operator+main_handler[body.argument.type](body.argument)
        : main_handler[body.argument.type](body.argument)+body.operator);
}

