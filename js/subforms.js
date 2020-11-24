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
		let isInvalidSequence
		[isInvalidSequence, message] = isInValidElementSequence(element, nextElement)
		if (isInvalidSequence) {
			if (nextElement) {
				message = message || `Caracter "${nextElement}" é invalido na posição ${index + 2}`
			} else {
				message = message || `Caracter "${element}" é invalido na posição ${index + 1}`
			}
			isValidFormula = false
			parenthesesController = 0
			break
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
		'<': ['-'],
		'-': ['>'],
		'>': ['variabel', '(', '~'],
		'op': ['variabel', '(', '~'],
		'variabel': ['op', ')', '-', '<', 'final'],
		'(': ['variabel', '(', '~'],
		')': ['op', ')', '-', '<', 'final'],
		'~': ['variabel', '('],
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
	const verifyFunctions = [isVariabel, isSimpleOperation, isLessThan, isGreaterThan, isMinus, isOpenParentheses, isCloseParentheses, isFinal, isNotOperation]
	
	const typesPerFunction = ['variabel', 'op', '<', '>', '-', '(', ')', 'final', '~']

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

const isSimpleOperation = element =>  /[\^v]/.test(element)

const isLessThan = element =>  /</.test(element)

const isGreaterThan = element =>  />/.test(element)

const isMinus = element =>  /\-/.test(element)

const isFinal = element => typeof(element) === 'undefined'

const isNotOperation = element =>  /~/.test(element)

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
	let subForms = new Set()

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
					subForms.add(element);
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
					subForms = new Set([...subForms, ...getSubForms(form.slice(parenthesesStart, parenthesesEnd))]);
					parenthesesIsOpen = false;
				}
			}
		}
	}

	if (dontHasUnnecesserParentheses) {
		subForms.add(form.join(""));
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
