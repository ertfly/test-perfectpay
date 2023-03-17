# Periodo de desenvolvimento
- Início: 15/03/2022
- Fim: 17/03/2022

# Requisitos
- Docker
- Docker Compose (aceite version '2')

# Entendendo a estrutura 
```
.
+-- front (desenvolvimento front)
+-- back (desenvolvimento back)
```
> **_NOTA:_**  Nas pastas **public** e **public/api** já tem o htaccess para tratar as rotas

# Instruções de instalação #
- Acesse a pasta onde irá clonar o projeto

- Faça o pull da imagem **ertfly/php7.4.9-apache-buster**
```
$ docker pull ertfly/php7.4.9-apache-buster
```
> **_NOTA:_**  A imagem foi criado por mim e pode validar o Dockerfile no link https://github.com/ertfly/dockerfile-php7.4.9-apache-buster

- Faça o pull da imagem **mariadb** (Imagem oficial)
```
$ docker pull mariadb
```

- Escolha uma pasta de preferência e clone o projeto
```
$ git clone https://github.com/ertfly/teste-redbelt.git
```

- Acesse a pasta do projeto
```
$ cd teste-redbelt
```

- Copie o arquivo **docker-compose.sample.yml** renomeando para **docker-compose.yml**
```
$ cp docker-compose.sample.yml docker-compose.yml
```
> **_NOTA:_**  Os arquivos copiados estão aplicados no .gitignore, e não causará efeitos de modificação

- Acesse a pasta do Laravel.
```
$ cd server
```

- Copie o arquivo **.env.example** renomeando para **.env**
```
$ cp .env.example .env
```
> **_NOTA:_**  Não mexa no arquivo **.env** pois já esta configurando com a estrutura dos containers
> **_NOTA:_**  O docker-compose foi configurado para que os containers tenha o seus hosts utilizando o atributo ***container_name**, exemplo o **DB_HOST** do arquivo **.env** ficaria **DB_HOST=teste.db** o nome dado no atributo, então é necessário que o docker-compose, na versão sitada, suba os containers com os nomes definidos, caso não terá que alterar os dados de acesso do banco, caso OK não precisa alterar pode deixar os dados como estão apenas execute a cópia.

- Volte a pasta raíz do projeto.
```
$ cd ../
```

- Criei o network dos containers
```
$ docker network create teste-dev
```
> **_NOTA:_**  Se a rede teste-dev já existir ignore.

- Altere o arquivo **docker-compose.yml** substitua na parte **8016** pela porta web disponível na sua máquina
```
    ...
    ports:
      - '8016:80'
    ...
``` 

- Altere o arquivo **docker-compose.yml** substitua na parte **3307** pela porta web disponível na sua máquina
```
    ...
    ports:
      - '3307:3306'
    ...
``` 

- Uma vez alterado o arquivo **docker-compose.yml** vamos utilizar o docker-compose para criar os containers
```
$ docker-compose up -d
```
> **_NOTA:_**  O comando reflete a versão do docker que não tem o docker-compose imbutido.

- Ao finalizar vamos instalar os pacotes das dependências
```
$ docker exec -it teste.api composer install
```
> **_NOTA:_**  O nome **teste.api** é o nome dado no container via atributo **container_name**, caso o atributo não funcionar na sua versão do docker-compose, é só renomear o container utilizando o comando `docker rename {id_do_container} teste.api`, o id do container pode ser consultado utilizando o comando `docker ps` procure o id na coluna **CONTAINER ID**.

- Vamos rodar o migrate da aplicação, por padrão já é criado automáticamente um usuário para acessar o sistema.
```
$ docker exec -it teste.api php artisan migrate
```
> **_NOTA:_**  O migrate irá criar um usuário **admin** e senha **admin** para acessar o ambiente e testar o CRUD

## Se sua máquina for linux ou mac leia
- No caso desses sitemas operacionais, as pastas do laravel **storage** ficam sem permissão de escrita, caso for execute os comandos abaixo.
```
$ sh chmod.sh
```
> **_NOTA:_**  O arquivo **chmod.sh** é um bash aplicando chmod nas pastas necessárias

## Testes unitários
- Caso queira executar os testes unitários, foram criados alguns cenários para atestar o conhecimento em PHPUnit.
```
$ docker exec -it teste.api vendor/bin/phpunit 
```

## Rodando a aplicação
- Na porta externa configurada no container **teste.api** no utilize para acessar o sistema http://localhost:{porta_configurada}/, caso não tenha alterado as portas basta acessar a parte default da configuração http://localhost:8016

## O que foi criado
- Seguindo os requisitos foi criado um CRUD de incidentes e adicionei um crud de usuários de acesso ao sistema.

## Dos requisitos algum não foi usado ?
- Todos os requisitos foram aplicados no teste com excessão do **redux**, no mais tudo foi seguido de acordo com o enunciado do teste.