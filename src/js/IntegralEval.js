/**
 * @projectDescription	javascript script that integrates an expression
 * 
 * @author	Hoda Mohammadi
 * @version	1.0
 * 
 * Symbols Supported:
 * +, -, *, /, ^, !, (, )
 * 
 * Functions Supported:
 * sin, cos, tan, log
 * 
 * Constants Supported:
 * e
 *
 */


//Global Variables
var output = "";



/**
 * Returns a symbolic expression of the integrated input
 * @param {Array} [inputArr] the parsed input array
 * @param {string} [iVar] variable of integration
 * @returns {string} [input] the integrated results
 */

function integrate(inputArr, iVar){

	var result = "";

	if (sumRule(inputArr)){
		var index = null;
		var operator = "";
		for (var i = 0; i < inputArr.length; i++){
			if (inputArr[i]=="+"){
				index = i;
				operator = "+";
				break;
			}else if (inputArr[i] == "-"){
				index = i;
				operator = "-";
				break;
			}
		}
			sumPart1 = basics(inputArr.slice(0, index), iVar);
			sumPart2 = basics(inputArr.slice(index+1, inputArr.length), iVar);
			return sumPart1.substring(0, sumPart1.length-2) + operator + sumPart2;

		}
		
	

	if (constantMultiple(inputArr)){
		var newArr = inputArr.slice(3, inputArr.length-1);

		if (sumRule(newArr)){
			var index = null;
			var operator = "";
			for (var i = 0; i < newArr.length; i++){
				if (newArr[i]=="+"){
					index = i;
					operator = "+";
					break;
				}else if (newArr[i] == "-"){
					index = i;
					operator = "-";
					break;
				}
			}
				sumPart1 = basics(newArr.slice(0, index), iVar);
				sumPart2 = basics(newArr.slice(index+1, newArr.length), iVar);
				return inputArr[0] + "*(" + sumPart1.substring(0, sumPart1.length-2) + operator + sumPart2 + ")";

		}else{
			return inputArr[0] + "*(" + basics((newArr), iVar) + ")";
		}
	}


	
	return basics(inputArr, iVar);


	

}


/**
 * Returns a symbolic expression from simple integrartion of input
 * @param {Array} [inputArr] the parsed input array
 * @param {string} [iVar] variable of integration
 * @returns {string} [input] the integrated results
 */

function basics(inputArr, iVar){

    if (isConstant(inputArr[0])){
    		if (inputArr.length == 1){			//input a
    				output = inputArr[0] + "*" + iVar;	//output ax
    
    		}else if(inputArr[1] == iVar){		//input ax
    
    			if (inputArr.length == 2){
    				output = "(" + inputArr[0] + "*" + iVar + "^" + 2 + ")/" + 2;	//output (ax^2)/2
    
    			}else if (inputArr[2] == "^"){		//input ax^
    
    				if (isConstant(inputArr[3])){ 		//input ax^b
    
    					if (inputArr.length == 4){
    							output = "(" + inputArr[0] + "*" + iVar + "^" + (parseFloat(inputArr[3])+1) + ")/" + (parseFloat(inputArr[3])+1);		//(ax^b+1)/b+1
    					}
    				}
    			}
    		}else if(inputArr[1] == "/" && inputArr[3] == iVar && inputArr.length == 4){		//input a*1/x
    			output = inputArr[0] + "ln |" + iVar + "|";		//output ln|x|
    
    		}else if(inputArr[1] == "^" && inputArr[3] == iVar && inputArr.length == 4){		//input a^x
    			output = inputArr[0] + "^" + iVar + "/" + "ln(" + inputArr[0] + ")"; 	//output a^x/ln(a)
    
    		}
    
    	}else if (inputArr[0] == "e^"  && inputArr[1] == "1" && inputArr[2] == iVar && inputArr.length == 3){		//input e^x
    	output = "e^" + iVar;		//output e^x
    
    	}else if (inputArr[0] == "ln" && inputArr[1] == "1" && inputArr[2] == iVar && inputArr.length == 3){	//input lnx
    		output = iVar + "ln(" + iVar + ") - " + iVar;		//output xln(x) - x
    
    	}else if (inputArr[0] == "cos" && inputArr[1] == "1" && inputArr[2] == iVar && inputArr.length == 3){		//input cosx
    		output = "sin(" + iVar + ")";		//output sin(x)
    
    	}else if (inputArr[0] == "sin" && inputArr[1] == "1" && inputArr[2] == iVar && inputArr.length == 3){		//input sinx
    		output = "-cos(" + iVar + ")";		//output -cos(x)
    
    	}else if (inputArr[0] == "tan" && inputArr[2] == iVar && inputArr.length == 3){		//input tanx
    		output = "ln|sec" + iVar + "|";		//output ln|secx|
    
    	}else if (inputArr[0] == "sec" && inputArr[1] == "^" && inputArr[2] == "2" && inputArr[3] == "1" && inputArr[4] == iVar && inputArr.length == 5){	//input sec^2(x)
    		output = "tan(" + iVar + ")";		//output tan(x)
    	}
	/*
	}else if(inputArr[0] == iVar){		//input x
			if (inputArr.length == 1){
				output = "(" + iVar + "^" + 2 + ")/" + 2;	//output (x^2)/2
			}else if (inputArr[1] == "^"){		//input x^
				if (isConstant(inputArr[2])){ 		//input x^b
					if (inputArr.length == 3){
							output = "(" + iVar + "^" + parseFloat(inputArr[2])+1 + ")/" + parseFloat(inputArr[2])+1;		//(x^b+1)/b+1
					}
				}
			}
	*/
	
    
	return output + "+C";

}



/**
 * Checks whether the a constant can be extracted from the input
 * @param {Array} [inputArr] the parsed input array
 * @returns {boolean} [constantMult] whether input is multiplied by a constant
 */

function constantMultiple(inputArr){
	var stack = [];
	var constantMult = false;
	if (isConstant(inputArr[0])){
		if (inputArr.length > 3){
			if (inputArr[1] == "*" && inputArr[2]=="("){
				for (var i = 3; i < inputArr.length-2; i++){
					if(inputArr[i] == '(')
			            stack.push(inputArr[i]);
			        else if(inputArr[i] == ')')
			            if(stack.length==0){
			                constantMult = false;
			            	break;

			            }else if(stack.peek() == '('){
			                stack.pop();
			            }
				}
				if ((inputArr[inputArr.length-1] == ")")){
					constantMult = true;
				}
			}
		}
	}
	return constantMult;
}



/**
 * Checks if an input array element is a constant
 * @param {string} [elem] the element that is being checked
 * @returns {boolean} [constant] whether the lement is constant
 */
function isConstant(elem){
    var constant = true;
    var constArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (var i = 0; i < elem.length; i++) {
        if (!(constArr.includes(elem[i]))){
        	constant = false; 
        }
    }
    return constant;
}




/**
 * Calculates the definite integral of an expression
 * @param {Array} [inputArr] the parsed input array
 * @param {string} [iVar] variable of integration
 * @param {string} [low] the lower bound
  * @param {string} [hi] the upper bound
 * @returns {string} an expression of the calculated definite integral
 */
function defIntegral(inputArr, iVar, low, hi){
	var result = integrate(inputArr, iVar);
	var index = null;
	for (var i = 0, len = result.length; i < len; i++) {
  		if (result[i]==iVar){
  			index=i;
  		}
	}
	resultLow = setCharAt(result, index,low);

	resultHi = setCharAt(result, index,hi);
	return (resultHi.substring(0, resultHi.length-3) + "-" + resultLow.substring(0, resultLow.length-3));

}


/**
 * Plugs in the lower and upper bound numbers into the integrating variable
 * @param {string} [str] the integrated symbolic expression 
 * @param {int} [index] the index of the integrating variable
 * @param {string} [chr] the number that is replacing the integrating variable
 * @returns {string} a string with numbers plugged into the integrating variable
 */

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}




/**
 * Checks whether the sum rule applies to the input
 * @param {string} [inputArr] the input array
 * @returns {boolean} [sumRule] whether or not the sum rule applies
 */
function sumRule(inputArr){

	var index = null;
	for (var i = 0; i < inputArr.length; i++){
		if (inputArr[i]=="+" || inputArr[i]=="-"){
			index = i;
			break;
		}
	}

	if (index==null){
		return false;
	}
	
	var stack = [];

	var sumRule= false;
	var part1 = false;
	var part2 = false;
	for (var i = 0; i < index; i++){
				if(inputArr[i] == '(')
		            stack.push(inputArr[i]);
		        else if(inputArr[i] == ')')
		            if(stack.length==0){
		                part1 = false;
		            	break;

		            }else if(stack.peek() == '('){
		                stack.pop();
		            }
	}

	if (stack.length == 0){
		part1 = true;
	}

	stack = [];

	for (var i = index+1; i < inputArr.length; i++){
				if(inputArr[i] == '(')
		            stack.push(inputArr[i]);
		        else if(inputArr[i] == ')')
		            if(stack.length==0){
		                part2 = false;
		            	break;

		            }else if(stack.peek() == '('){
		                stack.pop();
		            }
	}

	if (stack.length == 0){
		part2 = true;
	}

	if (part1 && part2){
		sumRule = true;
	}
	return sumRule;
}





