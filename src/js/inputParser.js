//var input = "x^2  + 3x + 5 + x + 1";
var input = "-2sin((575e^(x+4)+5x/3+3)/2)/5+10x^2"
var variable = "x";


module.exports = {
   parser: function(input) {
      return entrySplits(input);
   }
}

entrySplits(input);

function entrySplits(input){			//This function adds a space after every bracket or certain functions such as sin/cos/tan/e^ in order to parse more easily.

if(input.includes("+") || input.includes("-") || input.includes("/") || input.includes("*")){
	input = input.split("+").join(" + ");
	input = input.split("-").join(" - ");
	input = input.split("/").join(" / ");
	input = input.split("*").join(" * ");
}
if(input.includes("(") || input.includes(")")){
	input = input.split("(").join("( ");
	input = input.split(")").join(" )");
}
if(input.includes("cos") || input.includes("sin") || input.includes("tan")){
	input = input.split("sin").join(" sin ");
	input = input.split("cos").join(" cos ");
	input = input.split("tan").join(" tan ");
}
if(input.includes("e^")){
	input = input.split("e^").join(" e^ ");
}
var operations = ["+", "-", "/", "*"];		//^

var tempSplit = input.split(" "); 
var openBracket = 0;
var closeBracket = 0;

for(k = 0; k < tempSplit.length; k++){
	if(tempSplit[k].includes("("))
		openBracket++;
	if(tempSplit[k].includes(")"))
		closeBracket++;
}

if(openBracket == closeBracket){			//Checks for even number of open and close brackets. Will not run otherwise.
	parser(input, function(result){
	console.log(result);
	var parsedData = result;
	});
}
else{
	console.log("Please enter a valid expression. There is an invalid utilization of brackets(uneven number of open/close brackets)");
	
}
}

function parser(input){

	var parse1 = input.split(" ");
	console.log(parse1);
	var parse2 = [];
	var interval = 0;

	for(i = 0; i < parse1.length; i++){
		if(parse1[i].includes("(")){
			parse2[interval] = "(";
			interval++;
		}
		else if(parse1[i].includes(")")){
			parse2[interval] = ")";
			interval++;
		}
		else if(parse1[i].includes("sin")){
			var temp = parse1[i-1] == '';
			if(temp){

				parse2[interval] = 1;
				parse2[interval + 1] = "sin";
				interval = interval + 2;
			}
			else{
				parse2[interval] = "sin";
				interval++;
			}

			
			
		}
		else if(parse1[i].includes("cos")){
			var temp = parse1[i-1] == '';
			if(temp){
				parse2[interval] = 1;
				parse2[interval + 1] = "cos";
				interval = interval + 2;
			}
			else{
				parse2[interval] = "cos";
				interval++;
			}
		}
		else if(parse1[i].includes("tan")){
			var temp = parse1[i-1] == '';
			if(temp){
				parse2[interval] = 1;
				parse2[interval + 1] = "tan";
				interval = interval + 2;
			}
			else{
				parse2[interval] = "tan";
				interval++;
			}
		}
		else if(parse1[i].includes("e^")){
			parse2[interval] = "e^";
			interval++;
		}
		else if(parse1[i].includes(variable) && !parse1[i].includes("^")){
			if((parse1[i].split(variable)[0]) === ""){
				parse2[interval] = "1";
			}
			else
				parse2[interval] = parse1[i].split(variable)[0];

			parse2[interval + 1] = variable;
			interval = interval + 2;
		}
		else if(parse1[i].includes(variable) && parse1[i].includes("^") && !parse1[i].includes("e^")){
			if((parse1[i].split(variable)[0]) === ""){		//If there's no coefficient, add "1" to the index before the variable.
				parse2[interval] = "1";
			}
			else
				parse2[interval] = parse1[i].split(variable)[0];

			parse2[interval + 1] = variable;
			parse2[interval + 2] = "^";
			parse2[interval + 3] = parse1[i].split("^")[1];
			interval = interval + 4;
		}
		else{
			parse2[interval] = parse1[i];
			interval++;
		}
	//	console.log(parse2);		//New array, prints out each run
	}

	for(i = 0; i < parse2.length; i++){				//This removes any empty indicies if any exist.
		if(parse2[i] == ""){
			parse2.splice(i,1)
			console.log(parse2);					//Array cleanup
		}
	}

	for(i = 0; i < parse2.length; i++){				//This combines "negative" symbol indicies with following integers they exist
		if(parse2[i] == "-" && Number.isInteger(parseInt(parse2[i + 1]))){
			parse2[i+1] = parseInt(parse2[i + 1])*-1
			parse2.splice(i,1)

			console.log(parse2);					//Array cleanup
		}
	}
	return parse2;
}


