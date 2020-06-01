const { isNRLE, isSSN } = require('../../src/utils/several');

test('Validação de CPF', () => {
    expect(isSSN('44075171825')).not.toBeFalsy();
    expect(isSSN('34234324325')).toBeFalsy();
    expect(isSSN('')).toBeFalsy();
});

test('Validação de CNPJ', () => {
    expect(isNRLE('00000000000191')).not.toBeFalsy();
    expect(isNRLE('00000004005060')).toBeFalsy();
    expect(isNRLE('')).toBeFalsy();
})