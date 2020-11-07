const operators = ['~', '^', 'v', '-', '<', '>'];
var subFormulas = new Set();

removeWhiteSpaces = formula => {
	return formula.filter(element => element != " ");
};

hasMoreThanTenUniqueSymbols = formula => {
	var symbols = [];
	var setOfSymbols;

	formula.forEach(element => {
		if (!operators.includes(element) && !(element == "(" || element == ")")) {
			symbols.push(element);
		}
	});
	
	setOfSymbols = new Set(symbols);

	if (setOfSymbols.size <= 10) {
		return true;
	} else {
		return false;
	}
};

preProcessFormula = formula => {
	var processedFormula = formula.split("");
	processedFormula = removeWhiteSpaces(processedFormula);

	return processedFormula;
};

getSubFormulas = formula => {
	var parenthesesIsOpen = false;
	var extraParentheses = 0;
	var parenthesesStart = 0;
	var parenthesesEnd = 0;

	formula.forEach((element, index) => {
		if (!parenthesesIsOpen) {
			
			if (!operators.includes(element)) {
				if (element == "(") {
					parenthesesIsOpen = true;
					parenthesesStart = index+1;
				}
				else if (!(element == ")")) {
					subFormulas.add(element);
				}
			}

		} else {
			if (element == "(") {
				extraParentheses += 1;
			}
			else if (element == ")") {
				if (extraParentheses > 0) {
					extraParentheses -= 1;
				} else {
					parenthesesEnd = index
					getSubFormulas(formula.slice(parenthesesStart, parenthesesEnd));
				}
			}
		} 

	});
	subFormulas.add(formula.join(""));
}

module.exports = formula => {
	let processedFormula = preProcessFormula(formula);
	getSubFormulas(processedFormula);
	return [...subFormulas];
};
