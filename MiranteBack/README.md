- Projeto foi realizado com as tecnologias Node.js, Neo4j e Vue.js;
-   Na segurança foi utilizado o módulo bcryptjs para criptografar a senha da empresa e a biblioteca jsonwebtoken para a criação de dados da empresa criptografada;
    Na validação de dados foi utilizado um conjunto de middlewares chamado express-validator;
    Para realizar o acesso e ser possível executar as queries de banco foi utilizado o driver neo4j-driver
- As configurações do banco e porta podem ser configuradas dentro de um arquivo ".env";
- Esse sistema consiste em um gerenciamento de clientes. Após a empresa cadastrar seus dados e se logar, pode-se cadastrar, vizualizar, editar, filtrar e remover seus clientes.