const operators = ['~', '^', 'v', '-', '<', '>'];

const init = input => {
    document.getElementById('resultado_formula').innerHTML = '';
    removeAlert();
	
    if(input != '') {
		const vectorizedFormula = vectorizeForm(input);
		const processedFormula = removeWhiteSpaces(vectorizedFormula);
		const { isValidFormula, message } = validateFormula(processedFormula)
		if (isValidFormula) {
			if (hasMoreThanTenUniqueSymbols(processedFormula)) {
				createAlert('Digite uma fórmula com 10 ou menos variaveis');
			} else {
				for (subForm of getSubForms(processedFormula)) {
					document.getElementById('resultado_formula').innerHTML += '<p class="balao_resultado w3-animate-opacity">'+subForm+'</p>';
				}
			}
		} else {
			createAlert(message)
		}
    } else {
	createAlert('Digite uma fórmula!');
    }
}

const vectorizeForm = formula => formula.split("")

const removeWhiteSpaces = formula => formula.filter(element => element != " ")

const validateFormula = formula => {
	/*
	if the controller reaches a negative value then the expression is invalid
	if the expression finish with a value different from 0 the expression is invalid too
	*/
	let isValidFormula = true
	let message = 'sucess'
	let parenthesesController = 0

	const formulaLength = formula.length
	for(let index = 0; index < formulaLength; index++) {
		const element = formula[index]
		if (isOpenParentheses(element)) {
			parenthesesController++
		} else if (isCloseParentheses(element)) {
			parenthesesController--
		}

		if (parenthesesController < 0) {
			message = `Pareteses Invalido na posição ${index + 1}`
			isValidFormula = false
			parenthesesController = 0
			break
		}

		const nextElement = formula[index + 1]
		if (nextElement) {
			let isInvalidSequence
			[isInvalidSequence, message] = isInValidElementSequence(element, nextElement)
			if (isInvalidSequence) {
				message = message || `Caracter "${nextElement}" é invalido na posição ${index + 2}`
				isValidFormula = false
				parenthesesController = 0
				break
			}
		}
	}

	if (parenthesesController > 0) {
		message = 'Um ou mais pareteses não foram fechados'
		isValidFormula = false
	}

	return { isValidFormula, message }
}

const isInValidElementSequence = (element, nextElement) => {
	const sequenceRule = {
		'op': ['variabel', '('],
		'variabel': ['op', ')'],
		'(': ['variabel', '('],
		')': ['op', ')'],
	}

	let message =  ''
	let inValidSequence = false

	elementType = getElementType(element)
	nextElementType = getElementType(nextElement)

	if (!elementType) {
		message = `Caracter "${element}" não é valido um caracter valido`
		inValidSequence = true
	} else if (!nextElementType) {
		message = `Caracter "${nextElement}" não é valido um caracter valido`
		inValidSequence = true
	} else if (!sequenceRule[elementType].includes(nextElementType)) {
		inValidSequence = true
	}

	return [inValidSequence, message]
}

const getElementType = (element) => {
	const verifyFunctions = [isVariabel, isOperation, isOpenParentheses, isCloseParentheses]
	
	const typesPerFunction = {
		0: 'variabel',
		1: 'op',
		2: '(',
		3: ')',
	}

	let elementType = ''
	verifyFunctionslength = verifyFunctions.length
	for (let index = 0; index < verifyFunctionslength; index++) {
		if (verifyFunctions[index](element)) {
			elementType = typesPerFunction[index]
		}
	}

	return elementType 
}

const isOpenParentheses = element => element === '('

const isCloseParentheses = element => element === ')'

const isVariabel = element => /[A-Z]/.test(element)

const isOperation = element =>  /[~\^v\-<>]/.test(element)

const hasMoreThanTenUniqueSymbols = formula => {
	let symbols = [];
	let NoSymbolsElements = operators.concat(['(', ')'])

	for(element of formula) {
		if (!(NoSymbolsElements.includes(element))) {
			symbols.push(element);
		}
	}

	return symbols.length <= 10 ? false : true
}

const getSubForms = form => {
	let dontHasUnnecesserParentheses = true
	let parenthesesIsOpen = false;
	let extraParentheses = 0;
	let parenthesesStart = 0;
	let parenthesesEnd = 0;
	let subForms = []

	const formLenght = form.length
	for (let index = 0; index < formLenght; index ++) {
		const element = form[index]

		if (!parenthesesIsOpen) {
			if (!operators.includes(element)) {
				if (element == "(") {
					parenthesesIsOpen = true;
					parenthesesStart = index+1;
				}
				else if (!(element == ")")) {
					subForms.push(element);
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
					if (parenthesesStart == 1 && parenthesesEnd == formLenght - 1) {
						dontHasUnnecesserParentheses = false
					}
					subForms = subForms.concat(getSubForms(form.slice(parenthesesStart, parenthesesEnd)));
					parenthesesIsOpen = false;
				}
			}
		}
	}

	if (dontHasUnnecesserParentheses) {
		subForms.push(form.join(""));
	}

	return [...subForms];
}

const clean = () => {
	document.getElementById('resultado_formula').innerHTML = '';
	document.getElementById('input_formula').value = '';
	removeAlert()
}

const removeAlert = () => $('#input_alert').remove()

const createAlert = message => {
	const div = $('<div id="input_alert" class="alert alert-danger" role="alert"></div>div').text(message);
	$('#input_div').append(div);
}
