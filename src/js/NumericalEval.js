/**
 * @projectDescription	javascript script that calculates the answer to a symbolic 
 * expression
 * 
 * @author	Mikolaj Hrycko
 * @version	1.0
 * 
 * Symbols Supported:
 * +, -, *, /, ^, !, (, )
 * 
 * Functions Supported:
 * sin, cos, tan, asin, acos, atan, log, sqrt
 * 
 * Constants Supported:
 * e, pi, phi
 *
 */


//Global Variables
var constArr = [" ", ")(", ")a", ")c", ")s", ")l", ")t", "e", "pi", "phi"];
var constArr1 = ["", ")*(", ")*a", ")*c", ")*s", ")*l", ")*t", Math.E, Math.PI, (1+Math.sqrt(5))/2];
var mathFunctArr = ["sin", "cos", "tan", "asin", "acos", "atan", "log", "sqrt"];
var digits = ".0123456789";
var ptr = 0;

//Input
//var input = "-2cos((pi + pi*cos(pi))/4) + 5!/120 - cos(pi)";
var input = "pi";
var decimalAccuracy = 2;
//Functions

/**
 * Returns a properly formatted string expression
 * @param {string} [input]	the input string
 * @returns {string} [input] the refactored string
 */
function expressionRefactor(input){
	input = input.toLowerCase();
	
	for(var i = 0; i < constArr.length; i++)
	{
		input = input.split(constArr[i]).join(constArr1[i]);
	}
	
	var index = -1;
	for(i = 0; i <= mathFunctArr.length; i++)
	{
		index = input.indexOf(mathFunctArr[i]);
		if(index != -1)
		{ 
			if(digits.indexOf(input.charAt(index-1)) != -1)
			{
				input = input.substring(0, index) + "*" + input.substring(index, input.length);
				i--;
			}
		}
	}
	
	return input;
}

/**
 * Returns the answer to a symbolic expression
 * @param {string} [s]	the input string
 * @param {int} [start]	the starting index
 * @returns {float} the final answer to the expression
 */
function numericalEval(s, start){
	for(var i = start; i < s.length; i++)
		{
			switch(s.charAt(i))
			{
				case("("): ptr = i+1; return numericalEval(s, i+1);
				case(")"): s = opFind(s, ptr, i-1); ptr = 0; return numericalEval(s, 0);
			}
		}
	
	s = opFind(s, 0, s.length-1);
	
	//gives s at the requested decimal accuracy
	var dot = s.indexOf(".");
	if(dot != -1) s = s.substring(0, dot + decimalAccuracy + 1);
	
	return s;
}

/**
 * Returns the same input string, after the expression within
 * the brackets has been evaluated
 * @param {string [s] the input string
 * @param {int} [start] the starting index
 * @param {int} [end] the ending index
 * @returns {string} [s] the string after the operations are completed
 */
function opFind(s, start, end){
	
	for(var i = start; i <= end; i++)
	{
		if(s.charAt(i) == "!")
			{
				temp = factorialEval(s, i, start, end);
				s = temp[0];
				end = temp[1];
				i = start;
			}
	}
	
	for(var i = start; i <= end; i++)
		{
			if(s.charAt(i) == "^")
				{
					temp = opEval(s, i, start, end);
					s = temp[0];
					end = temp[1];
					i = start;
				}
		}
	
	for(var i = start; i <= end; i++)
	{
		if(s.charAt(i) == "/" || s.charAt(i) == "*")
			{
				temp = opEval(s, i, start, end);
				s = temp[0];
				end = temp[1];
				i = start;
			}
	}
	
	for(var i = start; i <= end; i++)
	{
		if(s.charAt(i) == "+" || s.charAt(i) == "-")
		{
			if(i == 0 || s.charAt(i-1) == "(" || s.charAt(i-1) == "*" || s.charAt(i-1) == "/" || s.charAt(i-1) == "^")
			{
				continue;
			}
			temp = opEval(s, i, start, end);
			s = temp[0];
			end = temp[1];
			i = start;
		}
	}

	var index = -1;
	var flag = false;
	var pos = 0;
	for(i = 0; i <= mathFunctArr.length; i++)
	{
		index = s.indexOf(mathFunctArr[i], pos);
		if(index != -1)
		{
			pos = index + mathFunctArr[i].length;
			
			if(start-1 == index + mathFunctArr[i].length)
			{ 
				flag = true;
				temp = functionEval(s, i, index, end+1);
				s = temp[0];
				end = temp[1];
				start-= mathFunctArr[i].length+1;
				pos = s.length;
			}
		}
		else
		{
			pos = s.length;
		}
		
		if(pos < s.length - 3)
		{
			i--;
		}
		else
		{
			pos = 0;
		}

	}
	
	if(end == s.length+1)
	{
		end == s.length-1;
	}
	if(flag)
	{
		return s; 
	}
	
	s = s.substring(0, start-1) + s.substring(start, end+1) + s.substring(end+2, s.length);
	return s;
}

/**
 * Returns the an array with the same input string, after the specified operation has 
 * been evaluated and the new ending index
 * @param {string} [s] the input string
 * @param {int} [op] the index of the operand
 * @param {int} [start] the start index
 * @param {int} [end] the end index
 * @returns {Array} an array of the manipulated string, and the new ending index
 */
function opEval(s, op, start, end){
	var op1 = 0, op2 = 0;
	var s1 = start, s2 = end;
	var sLen = s.length;
	var flag = false;
	
	for(var i = op-1; i >= start && !flag; i--)
	{		
		switch(s.charAt(i))
		{
			case("0"): break;
			case("1"): break;
			case("2"): break;
			case("3"): break;
			case("4"): break;
			case("5"): break;
			case("6"): break;
			case("7"): break;
			case("8"): break;
			case("9"): break;
			case("."): break;
			case("-"):
				if(i == 0 || s.charAt(i-1) == "(")
				{
					s1 = i;
					op1 = parseFloat(s.substring(i, op));
					flag = true;
					break;	
				}
			default:
				s1 = i+1;
				op1 = parseFloat(s.substring(i+1, op));
				flag = true;
				break;				
		}
	}
	
	if(i == start-1 && !flag)
	{
		s1 = start;
		op1 = parseFloat(s.substring(start, op));
	}
	
	flag = false;
	
	for(var i = op+1; i <= end && !flag; i++)
	{		
		switch(s.charAt(i))
		{
			case("0"): break;
			case("1"): break;
			case("2"): break;
			case("3"): break;
			case("4"): break;
			case("5"): break;
			case("6"): break;
			case("7"): break;
			case("8"): break;
			case("9"): break;
			case("."): break;
			case("-"):
				if(i == op+1)
				{
					break;
				}
			default:
				s2 = i;
				op2 = parseFloat(s.substring(op+1, i));
				flag = true;
				break;				
		}
	}
	
	if(i == end+1 && !flag)
	{
		s2 = end+1;
		op2 = parseFloat(s.substring(op+1, end+1));
	}

	switch(s.charAt(op))
	{
		case("^"): s = s.substring(0,s1) + Math.pow(op1, op2) + s.substring(s2, s.length); break;
		case("/"): s = s.substring(0,s1) + (op1/op2) + s.substring(s2, s.length); break;
		case("*"): s = s.substring(0,s1) + (op1*op2) + s.substring(s2, s.length); break;
		case("+"): s = s.substring(0,s1) + (op1+op2) + s.substring(s2, s.length); break;
		case("-"): s = s.substring(0,s1) + (op1-op2) + s.substring(s2, s.length); break;
	}
	return [s, end + (s.length - sLen)];
}

/**
 * Returns the factorial of the input integer
 * @param {int} [n] the input integer
 * @returns	{int} [ans] the factorial of n
 */
function factorial(n){
	var ans = 1;
	if(n == 0) return 1;
	for(var i = 1; i<=n; i++)
	{
		ans*=i;
	}
	return ans;	
}

/**
 * Returns an array with the new manipulated string and the 
 * new ending index
 * @param {string} [s] the input string
 * @param {int} [op] the index of the operand
 * @param {int} [start] the start index
 * @param {int} [end] the end index
 * @returns {Array} the manipulated string and new ending index
 */
function factorialEval(s, op, start, end){
	var op1 = 0;
	var s1 = start;
	var sLen = s.length;
	var flag = false;
	
	for(var i = op-1; i >= start && !flag; i--)
	{		
		switch(s.charAt(i))
		{
		case("0"): break;
		case("1"): break;
		case("2"): break;
		case("3"): break;
		case("4"): break;
		case("5"): break;
		case("6"): break;
		case("7"): break;
		case("8"): break;
		case("9"): break;
		default:
			s1 = i+1;
			op1 = parseFloat(s.substring(i+1, op));
			flag = true;
			break;				
		}
	}
	
	if(i == start-1 && !flag)
		{
			s1 = start;
			op1 = parseFloat(s.substring(start, op));
		}
	
	s = s.substring(0,s1) + factorial(op1) + s.substring(op+1, s.length); 

	return [s, end + (s.length - sLen)];
}

/**
 * Returns an array of the new manipulated string and
 * the new ending index
 * @param {string} [s] the input string
 * @param {int} [f] the index of the function in the array
 * @param {int} [index] the start index of the function
 * @param {int} [end] the end index
 * @returns {Array} the manipulated string and new ending index
 */
function functionEval(s, f, index, end){
	var f = mathFunctArr[f];
	var op1 = 0;
	var s2 = 0;
	var sLen = s.length;

	for(var i = index + f.length; i <= end; i++)
	{		
		if(s.charAt(i) == ")")
		{
			op1 = parseFloat(s.substring(index + f.length+1, i));
			s2 = i+1;
		}
	}
	var fn = eval("Math." + f + "(" + op1 + ");");
	
	if(Math.abs(fn) < 0.0000001)
	{
		fn = 0;
	}
	s = s.substring(0,index) + fn + s.substring(s2, s.length); 
	return [s, end + (s.length - sLen) - 2];
}

//Output
console.log("Done:  " + expressionRefactor(input) + " = " + numericalEval(expressionRefactor(input), 0));