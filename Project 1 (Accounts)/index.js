// Módulos externos
const inquirer = require("inquirer");
const chalk = require("chalk");

// Modulos internos
const fs = require("fs");

operation();

function operation() {

    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: ["Criar conta", "Consultar saldo", "Depositar", "Sacar", "Sair"],
    },
    ]).then((answer) => {
        const action = answer["action"];

        if (action === "Criar conta") {
            createAccount();
        } else if (action === "Depositar") {
            deposit();
        } else if (action === "Consultar saldo") {
            saldo()
        } else if (action === "Sacar") {
            saque();
        } else if (action === "Sair") {
            console.log(chalk.bgBlue.black("Obrigado por usar o accounts!"));
            process.exit();
        }

    }).catch(err => console.log(err));
}

// Envia a msg e chama a função base da criação do sistema

function createAccount() {
    console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
    console.log(chalk.green("Defina as opções da sua conta a seguir"));

    buildAccount();
};

// Função para criar conta
function buildAccount() {

    inquirer.prompt([
        {
            name: "accountName",
            message: "Digite um nome para a sua conta"
        }
    ]).then((answer) => {
        const accountName = answer["accountName"];

        console.info(`O nome que vc escolheu é: ${accountName}`);

        if (!fs.existsSync("accounts")) {
            fs.mkdirSync("accounts");
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black("Está conta já existe, escolha outro nome!"));
            buildAccount();
            return;
        } else if (!fs.existsSync(`accounts/${accountName}.json`)) {
            fs.writeFileSync(`accounts/${accountName}.json`, '{"Balance": 0}', function (err) {
                console.log(err);
            });

            console.log(chalk.green(`Parabéns ${accountName}, a sua conta foi criada com sucesso`));
            operation();
        }

    }).catch(err => console.log(err));
}

//  Função para verificar se a conta existe

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("Esta conta não existe, escolha outro nome!"))
        return false;
    }

    console.log(chalk.bgBlue.black("Conta encontrada com sucesso!"));
    return true;

}

// Função para obter a conta
function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

// Função de depositar 

function deposit() {
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?",
    }]).then((answer) => {

        const accountName = answer["accountName"];

        // Verificar se a conta existe!
        if (!checkAccount(accountName)) {
            return deposit();
        }

        inquirer.prompt([{
            name: "amount",
            message: "Quanto você deseja depositar?"
        }]).then((answer) => {

            const amount = answer['amount']

            // add amount
            addAmount(accountName, amount);
            operation();

        }).catch(err => console.log(err))

    }).catch(err => console.log(err));
};

// Corpo para função de depositar
function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(
            chalk.bgRed.black(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!')),
        )
        return deposit()
    }

    accountData.Balance = parseFloat(amount) + parseFloat(accountData.Balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(
        chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`),
    )
}

// Função de saque
function saque() {
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?"
    }]).then((answer) => {

        const accountName = answer["accountName"]

        if (!checkAccount(accountName)) {
            return saque();
        }

        inquirer.prompt([{
            name: "amount",
            message: "Qual o valor você deseja sacar?"
        }]).then((answer => {
            const amount = answer["amount"];

            subtraiAmount(accountName, amount);
            return operation();

        })).catch(err => console.log(err));

    }).catch(err => console.log(err));
}

// Corpo para função de saque
function subtraiAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(
            chalk.bgRed.black(chalk.bgRed.black('É obrigatório informar o valor que deseja sacar!')),
        )
        return saque()
    }

    if (accountData.Balance < amount) {
        console.log(chalk.bgRed.black("O valor que inseriu não está disponivel para o saque!"));
    }else {
        accountData.Balance = Number(accountData.Balance - amount);
        console.log(chalk.green(`Foi sacado o valor de R$${amount} na sua conta!`))

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            JSON.stringify(accountData),
            function (err) {
                console.log(err)
            },
        )
    }
}

function saldo() {

    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?",
    }]).then((answer) => {
        const accountName = answer["accountName"];

        if(!checkAccount(accountName)) {
            return saldo();
        }else {
            const accountData = getAccount(accountName)

            console.log((`O saldo da sua conta ${accountName}, é de: ${chalk.red(accountData.Balance + "R$")}`));
            return operation();
        }
    }).catch(err => console.log(err));
}