var output = "";


function integrate(inputArr, iVar){


//add function that checks if x is another expression and send it through parser and integrate again
//figure out brackets

/*

	if (constantMultiple(inputArr)){
		return inputArr[0] + "*(" + integrate(inputArr[2, inputArr.length-2], iVar) + ")";
	}

*/

	if (isConstant(inputArr[0])){
		if (inputArr.length == 1){			//input a
				output = inputArr[0] + iVar;	//output ax
		}else if(inputArr[1] == iVar){		//input ax
			if (inputArr.length == 2){
				output = "(" + inputArr[0] + iVar + "^" + 2 + ")/" + 2;	//output (ax^2)/2
			}else if (inputArr[2] == "^"){		//input ax^
				if (isConstant(inputArr[3])){ 		//input ax^b
					if (inputArr.length == 4){
							output = "(" + inputArr[0] + iVar + "^" + (parseFloat(inputArr[3])+1) + ")/" + (parseFloat(inputArr[3])+1);		//(ax^b+1)/b+1
					}
				}
			}
		}else if(inputArr[1] == "/" && inputArr[2] == iVar && inputArr.length == 3){		//input a*1/x
			output = inputArr[0] + "ln |" + iVar + "|";		//output ln|x|
		}else if(inputArr[1] == "^" && inputArr[2] == iVar && inputArr.length == 3){		//input a^x
			output = inputArr[0] + "^" + iVar + "/" + "ln(" + inputArr[0] + ")"; 	//output a^x/ln(a)
		}
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
	}else if (inputArr[0] == "e" && inputArr[1] == "^" && inputArr[2] == iVar && inputArr.length == 3){		//input e^x
		output = "e^" + iVar;		//output e^x

	}else if (inputArr[0] == "ln" && inputArr[1] == iVar && inputArr.length == 2){	//input ln(x)
		output = iVar + "ln(" + iVar + ") - " + iVar;		//output xln(x) - x

	}else if (inputArr[0] == "cos" && inputArr[1] == iVar && inputArr.length == 2){		//input cos(x)
		output = "sin(" + iVar + ")";		//output sin(x)

	}else if (inputArr[0] == "sin" && inputArr[1] == iVar && inputArr.length == 2){		//input sin(x)
		output = "-cos(" + iVar + ")";		//output -cos(x)

	}else if (inputArr[0] == "sec" && inputArr[1] == "^" && inputArr[2] == "2" && inputArr[3] == iVar && inputArr.length == 4){	//input sec^2(x)
		output = "tan(" + iVar + ")";		//output tan(x)
	}

	return output + "+ C";

}



/*

function constantMultiple(inputArr){
	var constantMult = true;
	if (isConstant(inputArr[0])){
		if (inputArr[1] == "("){
			for (var i = 1; i < inputArr.length-1; i++){
				if(inputArr[i] == '(')
		            stack.push(inputArr[i]);
		        else if(inputArr[i] == ')')
		            if(stack.empty())
		                constantMult = false;
		            else if(stack.peek() == '(')
		                stack.pop();
			}
			if (!(inputArr[inputArr.length-1] == ")")){
				constantMult = false;
			}
		}
	}
	return constantMult;
}
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
