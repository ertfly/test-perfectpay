# Periodo de desenvolvimento
- Início: 15/03/2022
- Fim: 17/03/2022

# Requisitos
- Docker
- Docker Compose (aceite version '2')

# Instruções de instalação #
- Acesse a pasta onde irá clonar o projeto

- Faça o pull da imagem **ertfly/php8.1-apache-buster**
```
$ docker pull ertfly/php8.1-apache-buster
```
> **_NOTA:_**  A imagem foi criado por mim e pode validar o Dockerfile no link https://github.com/ertfly/dockerfile-php8.1-apache-buster

- Escolha uma pasta de preferência e clone o projeto
```
$ git clone https://github.com/ertfly/test-perfectpay.git
ou
$ git clone git@github.com:ertfly/test-perfectpay.git
```

- Acesse a pasta do projeto
```
$ cd test-perfectpay
```

# Entendendo a estrutura 
```
.
+-- front (desenvolvimento front)
+-- back (desenvolvimento back)
```

- Copie o arquivo **docker-compose-sample.yml** renomeando para **docker-compose.yml**
```
$ cp docker-compose-sample.yml docker-compose.yml
```
> **_NOTA:_**  Os arquivos copiados estão aplicados no .gitignore, e não causará efeitos de modificação

- Acesse a pasta do backend.
```
$ cd back
```

- Copie o arquivo **.env.example** renomeando para **.env**
```
$ cp .env.example .env
```

- Volte a pasta raíz do projeto.
```
$ cd ../
```

- Acesse a pasta do front.
```
$ cd front
```

- Copie o arquivo **.env.sample** renomeando para **.env**
```
$ cp .env.sample .env
```

- Volte a pasta raíz do projeto.
```
$ cd ../
```

- Criei o network dos containers
```
$ docker network create test-net
```
> **_NOTA:_**  Se a rede test-net já existir ignore.

- Caso tenha necessidade pode alterar as portas no arquivo **docker-compose.yml**  sua máquina.
```
    ...
    ports:
      - '3000:3000'
    ...
    ...
    ports:
      - '8030:80'
    ...
``` 

- Uma vez alterado o arquivo **docker-compose.yml** vamos utilizar o docker-compose para criar os containers
```
$ docker-compose up -d
```
> **_NOTA:_**  O comando reflete a versão do docker que não tem o docker-compose imbutido.

- Ao finalizar vamos instalar os pacotes das dependências
```
$ docker exec -it test.back composer install
```
> **_NOTA:_**  O nome **test.back** é o nome dado no container via atributo **container_name**, caso o atributo não funcionar na sua versão do docker-compose, é só renomear o container utilizando o comando `docker rename {id_do_container} test.back`, o id do container pode ser consultado utilizando o comando `docker ps` procure o id na coluna **CONTAINER ID**.

## Se sua máquina for linux ou mac leia
- No caso desses sitemas operacionais, as pastas do laravel **storage** ficam sem permissão de escrita, caso for execute os comandos abaixo.
```
$ sh chmod.sh
```
> **_NOTA:_**  O arquivo **chmod.sh** é um bash aplicando chmod nas pastas necessárias

## Rodando a aplicação
- Na porta externa configurada no container **test.front** utilize para acessar o sistema http://localhost:{porta_configurada}/, caso não tenha alterado as portas basta acessar a parte default da configuração http://localhost:3000

## O que foi criado
- Seguindo os requisitos foi um checkout com opção de cartão de crédito e boleto.