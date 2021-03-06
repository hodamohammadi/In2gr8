/**
 * @projectDescription	javascript script that calculates the derivative 
 * to a mathematical equation
 *  
 * @author	Mikolaj Hrycko
 * @version	1.0
 * 
 * Restrictions on Input:
 * - must be fully simplified
 * - no "*" supported, instead use brackets, ex. 2*x -> 2x
 */

//function Imports
const numEval = require('./NumericalEval');
//const Parser = require('./parser');

//inputs
var input = "2sin((575e^(x+4)+5x/3+3)/2)/5+10x^2";


//Global Variables
var variable = "x";
var digits = ".0123456789";
var functions = "ln sin cos tan e^".concat(" ",variable,"^");
var finalOutput = "";

//let output = Parser.parser(input);

//var output = ['2','sin','(','(','575','e^','(','x','+','4',')','+','5','x','/','3','+','3',')','/','2',')','/','5','+','10','x^','2'];
//var output = ['3','sin','(','x',')'];
//var output = ['(','-3','x',')','(','x^','3',')','(','x^','2',')'];
//var output = ['(','575','e^','(','x','+','4',')','+','5','x','/','3','+','3',')','/','2'];
var output = ['2','x'];

//Functions

/**
 * Calculates the derivative of an equation and outputs it to finalOutput
 * @param {Array} arr - the equation after it is parsed
 * @param {int} start - the start index
 * @param {int} end - the end index
 */
function DerivativeEval(arr, start, end){
	
	//Finds all of the outer terms and places them in a function set
	var funSet = [];

	for(var i = start; i < end; i++)
	{
		//if number
		if(Math.abs(+arr[i]) > 0)
		{
			if(funSet.length == 0)
			{
				funSet.push([arr[i], i, i+1]);
				continue;
			}
			if(funSet[funSet.length-1][2] <= i)
			{
				funSet.push([arr[i], i, i+1]);
			}
		}
		//if function
		else if(functions.indexOf(arr[i]) != -1)
		{
			if(funSet.length == 0)
			{
				if(arr[i] == "e^" || arr[i] == variable.concat("^"))
				{
					if(arr[i+1] != "("){funSet.push([arr[i], i+1, i+2]);}
					else{funSet.push([arr[i], i+2, bracketFind(arr, i+1)]);}
				}
				else if(arr[i] == variable){funSet.push([arr[i], i, i+1]);}
				else{funSet.push([arr[i], i+2, bracketFind(arr, i+1)]);}				
				continue;
			}
			if(funSet[funSet.length-1][2] <= i)
			{
				if(arr[i] == "e^" || arr[i] == variable.concat("^"))
				{
					if(arr[i+1] != "("){funSet.push([arr[i], i+1, i+2]);}
					else{funSet.push([arr[i], i+2, bracketFind(arr, i+1)]);}
				}
				else if(arr[i] == variable){funSet.push([arr[i], i, i+1]);}
				else{funSet.push([arr[i], i+2, bracketFind(arr, i+1)]);}			
			}
		}
		//if function within bracket
		else if(arr[i] == "(")
		{
			if(funSet.length == 0)
			{
				funSet.push([0, i+1, bracketFind(arr, i)]);
				continue;
			}
			if(funSet[funSet.length-1][2] <= i)
			{
				funSet.push([0, i+1, bracketFind(arr, i)]);
			}
		}
		//if division followed by function
		else if(arr[i] == "/")
		{
			if(funSet.length == 0)
			{
				if(arr[i+1] == "("){funSet.push(["/",i+2,bracketFind(arr,i+1)]);}
				else{funSet.push(["/",i+1,i+2]);}
				continue;
			}
			if(funSet[funSet.length-1][2] <= i)
			{
				if(arr[i+1] == "("){funSet.push(["/",i+2,bracketFind(arr,i+1)]);}
				else{funSet.push(["/",i+1,i+2]);}
			}
		}
		//if plus operator, separating terms
		else if(arr[i] == "+")
		{
			if(funSet.length == 0)
			{
				funSet.push(["+",i,i+1]);
				continue;
			}
			if(funSet[funSet.length-1][2] <= i)
			{
				funSet.push(["+",i,i+1]);
			}
		}
	}

	if(funSet.length > 1)
	{
		functionEval(arr, funSet);
	}
	else
	{
		if(funSet.length == 1 && funSet[0][0] != "0"){return termEval(arr, funSet);}
		else{DerivativeEval(arr, funSet[0][1], funSet[0][2])}
	}
}

/**
 * Takes an array with different terms, and determines the proper way of
 * deriving the functions
 * @param {Array} arr - the equation after it is parsed
 * @param {Array} funSet - an array with the terms separated into different elements
 */
function functionEval(arr, funSet){
	//Start deriving based off of the rules(ex.sum, product, quotient)
	var prodSet = [];
	for(var j = 0; j < funSet.length; j++)
	{

		if(funSet[j][0] != "+")
		{
			if(funSet[j][0] != "/")
			{
				//add function to product array
				prodSet.push(funSet[j]);
			}
			else
			{
				//quotient rule
				finalOutput = finalOutput.concat("+");
				quotientRule(arr, prodSet, funSet, j);
				prodSet = [];
			}
		}
		else
		{
			//product rule
			finalOutput = finalOutput.concat("+");
			productRule(arr, prodSet);
			prodSet = [];
		}
	}
	if(prodSet.length != 0)
	{
		if(prodSet.length == 1 && Math.abs(+prodSet[0][0]) > 0){finalOutput = finalOutput.substring(0,finalOutput.length-1)}
		//product rule
		productRule(arr, prodSet);
		prodSet = [];
	}
}

/**
 * Takes an array with 1 term, and outputs the derivative of that term
 * @param {Array} arr - the equation after it is parsed
 * @param {Array} funSet - an array that contains the term to be derived
 * @return {string} dv - a string that contains the derivative of the input term
 */
function termEval(arr, funSet){
		
	if(funSet.length == 0){return "0";}
	
	if(Math.abs(+funSet[0][0]) > 0)
	{
		finalOutput = finalOutput.concat("0"); return "0";
	}

	var dv = "";
	var x = arrToString(arr, funSet[0][1], funSet[0][2]);
	
	var t = finalOutput;
	finalOutput = "";
	if(funSet[0][0] == "x"){finalOutput = finalOutput.concat("(1)"); return dv;}
	DerivativeEval(arr, funSet[0][1], funSet[0][2]);
	var t1 = outputCleanUp(finalOutput);
	finalOutput = "";
	finalOutput = finalOutput.concat(t);
	
	switch(funSet[0][0])
	{
	case("ln"): dv = dv.concat("(1/",x, ")"); break;
	case("sin"): dv = dv.concat("(cos", x, ")", t1); break;
	case("cos"): dv = dv.concat("(-sin", x, ")", t1); break;
	case("tan"): dv = dv.concat("(sec^2", x, ")", t1); break;
	case("x"): dv = dv.concat("(1)"); break;
	case("e^"): dv = dv.concat("(e^", x, ")"); break;
	case(variable.concat("^")): dv = dv.concat("(", x, variable, "^", (parseFloat(x.substring(1, x.length-1))-1), ")"); break;
	}
	finalOutput = finalOutput.concat(dv);
	return dv;
}

/**
 * Takes an array with different terms that are multiplied together and 
 * derives them based on the product rule, and places that in finalOutput
 * @param {Array} arr - the equation after it is parsed
 * @param {Array} prodSet - an array with the terms separated into different elements
 */
function productRule(arr, prodSet){

	var flag = false;
	for(var a = 0; a < prodSet.length; a++)
	{
		for(var b = 0; b < prodSet.length; b++)
		{
			if(a == b)
			{
				if(Math.abs(+prodSet[b][0]) > 0){break;}
				else if(prodSet[b][0] == variable.concat("^") || prodSet[b][0] == "e^")
				{
					if(arr[prodSet[b][1] - 1] != "("){DerivativeEval(arr, prodSet[b][1]-1, prodSet[b][2]);}
					else{DerivativeEval(arr, prodSet[b][1]-2, prodSet[b][2]);}
				}
				else if(prodSet[b][0] == variable){continue;}
				else if(prodSet[b][0] == '0'){DerivativeEval(arr, prodSet[b][1], prodSet[b][2]);}
				else
				{
					DerivativeEval(arr, prodSet[b][1]-2, prodSet[b][2]);
				}
				flag = true;
			}
			else
			{
				var t = 0;
				if(prodSet[b][1]-2 > 0){var t = prodSet[b][1]-2}
				if(prodSet[b][0] == '0'){finalOutput = finalOutput.concat(arrToString(arr, prodSet[b][1], prodSet[b][2]));}
				else{finalOutput = finalOutput.concat(arrToString(arr, arr.indexOf(prodSet[b][0], t), prodSet[b][2]));}
			}
		}
		if(flag){finalOutput = finalOutput.concat("+");	flag = false;}
	}
}

/**
 * Takes an array with different terms that are multiplied together and divided
 * by a term, and derives them based on the quotient rule, and places that in finalOutput
 * @param {Array} arr - the equation after it is parsed
 * @param {Array} prodSet - an array with the terms separated into different elements
 * @param {Array} g - an array with the terms separated into different elements
 * @param {int} j - the index of the term after the division sign
 */
function quotientRule(arr, prodSet, g, j){

	finalOutput = finalOutput.concat("(");
	
	productRule(arr, prodSet);

	finalOutput = finalOutput.concat(")");

	if(prodSet.length != 1 || Math.abs(+prodSet[0][0]) <= 0)
	{
			var t = arr.indexOf(g[j][0], g[j][1]-2) + 1;
			if(arr[t] == "("){finalOutput = finalOutput.concat(arrToString(arr, t + 1, g[j][2]));}
			else{finalOutput = finalOutput.concat(arrToString(arr, t, g[j][2]));}	
	}
	if(arr[g[j][1]-1] != "(" && prodSet.length == 1 && Math.abs(+prodSet[0][0]) > 0){return "";}

	if(arr[g[j][1]-1] == "(")
	{
		var t = finalOutput;
		finalOutput = "";
		DerivativeEval(arr, g[j][1] - 1, g[j][2])
		var t1 = finalOutput;
		finalOutput = "";
		finalOutput = finalOutput.concat(t,"-",t1);
		for(var i = 0; i < prodSet.length; i++)
		{
			var t = 0;
			if(prodSet[i][1]-2 > 0){var t = prodSet[i][1]-2}
			if(prodSet[i][0] == "0"){finalOutput = finalOutput.concat(arrToString(arr, prodSet[i][1], prodSet[i][2]));}
			else{finalOutput = finalOutput.concat(arrToString(arr, arr.indexOf(prodSet[i][0], t), prodSet[i][2]));}		
		}
	}
	
	finalOutput = finalOutput.concat("/");

	if(arr[g[j][1]-1] != "(")
	{
		finalOutput = finalOutput.concat(Math.pow(+arr[g[j][1]], 2).toString());
	}
	else
	{
		finalOutput = finalOutput.concat('(',arrToString(arr, g[j][1], g[j][2]),"^2))");
	}	
}

/**
 * Takes an array, starts at a left bracket and finds the corresponding right bracket
 * @param {Array} arr - the equation after it is parsed
 * @param {Array} start - the start index, that contains the left bracket
 * @return {int} i - the index of the term with the corresponding right bracket
 */
function bracketFind(arr, start){
	var left = 0;
	var right = 0;
	
	for(var i = start; i < arr.length; i++)
	{
		if(arr[i].includes(")(")){return i}
		else if(arr[i].includes("(")){left++}
		else if(arr[i].includes(")")){right++}
		
		if(left == right){return i}
	}
}

/**
 * Returns the string representation of given indices of the array
 * @param {Array} arr - the equation after it is parsed
 * @param {int} s - the start index
 * @param {int} e - the end index
 * @return {int} out - the string with the array elements in string form
 */
function arrToString(arr, s, e)
{
	var out = '(';
	for(var i = s; i < e; i++)
	{
		out = out.concat(arr[i]);
	}
	out = out.concat(')');
	return out;
}

/**
 * Returns the input string after it is cleaned up
 * @param {string} finalOutput - the string containing the derivative
 * @return {string} finalOutput - the string after it is cleaned up
 */
function outputCleanUp(finalOutput){
	finalOutput = finalOutput.split("+-").join("-");
	finalOutput = finalOutput.split("-+").join("-");
	finalOutput = finalOutput.split("(+").join("(");
	finalOutput = finalOutput.split("^1").join("");
	finalOutput = finalOutput.split("++").join("+");
	finalOutput = finalOutput.split("+)").join(")");
	if(finalOutput.charAt(0) == "+"){finalOutput = finalOutput.substring(1,finalOutput.length)}
	if(finalOutput.charAt(finalOutput.length-1) == "+"){finalOutput = finalOutput.substring(0,finalOutput.length-1)}
	if(finalOutput == "0" || finalOutput == "()"){finalOutput = "0"}
	
	return finalOutput;
}

//output
DerivativeEval(output, 0, output.length);
finalOutput = outputCleanUp(finalOutput);

if(finalOutput.indexOf(variable) == -1)
{
	finalOutput = numEval.ne(finalOutput);
}

console.log("Expression: " + arrToString(output, 0, output.length));
console.log("Derivative: " + finalOutput);

