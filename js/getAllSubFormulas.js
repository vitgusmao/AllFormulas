const operators = ['~', '^', 'v', '-', '<', '>'];

funcao = formula => {
	var parentesesAberto = false;
	var parentesesExtrasAbertos = 0;
	var inicio = 0;
	var fim = 0;

	formula.forEach((elemento, index) => {
		if (!parentesesAberto) {
			
			if (!operators.includes(elemento)) {
				if (elemento == "(") {
					parentesesAberto = true;
					inicio = index+1;
				}
				else if (!(elemento == ")")) {
					console.log("subformula: ", elemento);
				}
			} else console.log("operador: ", elemento);

		} else {
			if (elemento == "(") {
				parentesesExtrasAbertos += 1;
			}
			else if (elemento == ")") {
				if (parentesesExtrasAbertos > 0) {
					parentesesExtrasAbertos -= 1;
				} else {
					fim = index
					funcao(formula.slice(inicio, fim));
				}
			}
		} 

	});
	console.log("subformula: ", formula)
}

module.exports = funcao;
