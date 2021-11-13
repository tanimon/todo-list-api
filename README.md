# todo-list-api

ToDo リストアプリのための REST API サーバです。

## 必要条件

このアプリケーションを実行するには以下の条件を満たしている必要があります。

- [Node.js](https://nodejs.org/ja/) がインストールされている
- [Yarn](https://yarnpkg.com/) がインストールされている
- [MySQL](https://www.mysql.com/jp/) がインストールされている（ローカル環境での実行に必要）
- [AWS SAM CLI](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) がインストール（デプロイに必要）
- [AWS CLI](https://aws.amazon.com/jp/cli/) がインストールされている（Cognito ユーザの作成に必要）

## インストール

以下のコマンドを実行してください。

```bash
yarn
```

## アプリケーションをローカル環境で実行する

このアプリケーションは DB の接続に環境変数を参照します。
`.env` というファイル名で以下の変数の値を設定したファイルを作成してください。
アプリケーション内部で `.env` ファイルを自動で読み込み、環境変数として利用します。

```sh
DB_HOST=<DB host>
DB_USERNAME=<DB username>
rB_PASSWORD=<Password for the $DB_USERNAME user>
DB_NAME=<DB name to connect>
```

アプリケーションを起動するには以下のコマンドを実行してください。
http://localhost:3000 からアプリケーションにアクセスできます。

```sh
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

## API 仕様

[./docs/redoc-static.html](./docs/redoc-static.html) で API 仕様を確認することができます。

また、`yarn start` を実行してアプリケーションを起動後、 http://localhost:3000/api にアクセスすることで、 [Swagger UI](https://swagger.io/tools/swagger-ui/) で API 仕様を確認することもできます。

## テスト

テストを実行するには以下のコマンドを実行してください。

```bash
yarn test
```

## デプロイ

以下のコマンドを実行してください。

```sh
# build the application
yarn build

# build the AWS SAM templates
sam build

# deploy the application to AWS
sam deploy --guided
```

## Cognito ユーザの ID トークンの取得

デプロイしたアプリケーションを実行するには、Cognito でユーザ認証を行う必要があります。
そのために、Cognito ユーザを作成し、そのユーザの ID トークンを取得する必要があるので、その手順を解説します。

以下の Shell 変数が設定されている前提で説明します。

```sh
USER_POOL_ID=<Cognito user pool ID>
CLIENT_ID=<Cognito user pool client ID>
USERNAME=<Cognito username>
PASSWORD=<Password for $USERNAME>
```

`USER_POOL_ID` および `CLIENT_ID` に設定すべき値は `sam deploy` コマンドの実行結果で確認できます。

まずは、以下のコマンドで、ユーザをクライアントプールに登録します。

```sh
aws cognito-idp sign-up \
  --client-id ${CLIENT_ID} \
  --username ${USERNAME} \
  --PASSWORD ${PASSWORD}
```

次に、以下のコマンドで、作成したユーザの確認を行います。

```sh
aws cognito-idp admin-confirm-sign-up \
  --user-pool-id ${USER_POOL_ID} \
  --username ${USERNAME}
```

最後に、以下のコマンドで ID トークンを取得します。

```sh
aws cognito-idp admin-initiate-auth \
  --user-pool-id ${USER_POOL_ID} \
  --client-id ${CLIENT_ID} \
  --auth-flow "ADMIN_USER_PASSWORD_AUTH" \
  --auth-parameters USERNAME=${USERNAME},PASSWORD=${PASSWORD} \
  --query "AuthenticationResult.IdToken" | sed s/\"//g
```

取得した ID トークンを HTTP リクエストの `Authorization` ヘッダに設定することで、ユーザ認証が行えます。
