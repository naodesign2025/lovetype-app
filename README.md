# lovetype-app

恋愛タイプ診断アプリ。質問に答えることで、自分の恋愛タイプ（fire / mystery / angel / devil）を診断し、結果を保存・管理できます。

## 技術スタック

- **Backend**: Node.js / Express.js
- **Database**: Supabase (PostgreSQL)
- **認証**: JWT + bcrypt
- **Frontend**: 静的 HTML (`public/index.html`)

## 診断タイプ

| タイプ | 説明 |
|--------|------|
| `fire` | 情熱の一途系 |
| `mystery` | ミステリアス系 |
| `angel` | 天使系 |
| `devil` | 悪魔系 |

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、各値を設定します。

```bash
cp .env.example .env
```

| 変数名 | 説明 |
|--------|------|
| `PORT` | サーバーのポート番号（デフォルト: 3000） |
| `SUPABASE_URL` | Supabase プロジェクト URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロールキー |
| `JWT_SECRET` | JWT 署名用シークレットキー |

JWT_SECRET の生成例:
```bash
openssl rand -base64 32
```

### 3. データベースのセットアップ

Supabase ダッシュボードの SQL Editor で `schema.sql` を実行します。

```sql
-- schema.sql の内容をそのまま貼り付けて実行
```

### 4. サーバー起動

```bash
node server.js
```

`http://localhost:3000` にアクセスするとアプリが起動します。

## API エンドポイント

### 認証 (`/api/auth`)

| メソッド | パス | 説明 |
|----------|------|------|
| POST | `/api/auth/register` | ユーザー登録 |
| POST | `/api/auth/login` | ログイン（JWT 発行） |

### 診断結果 (`/api/results`)

| メソッド | パス | 説明 |
|----------|------|------|
| POST | `/api/results` | 診断結果を保存 |
| GET | `/api/results` | 自分の診断結果一覧を取得 |

結果系のエンドポイントは JWT 認証が必要です（`Authorization: Bearer <token>`）。

## ディレクトリ構成

```
lovetype-app/
├── public/
│   └── index.html       # フロントエンド
├── routes/
│   ├── auth.js          # 認証ルート
│   └── results.js       # 診断結果ルート
├── middleware/
│   └── auth.js          # JWT 認証ミドルウェア
├── lib/                 # 共通ユーティリティ
├── server.js            # エントリーポイント
├── schema.sql           # DB スキーマ
├── .env.example         # 環境変数サンプル
└── package.json
```

## Security Testing Report

### テスト実施概要

| 項目 | 内容 |
|------|------|
| 対象 | lovetype-app v1.0.0 |
| テスト日 | - |
| テスト担当 | - |
| テスト環境 | ローカル / ステージング |

### チェック項目

#### 認証・認可
- [ ] パスワードが bcrypt でハッシュ化されていることを確認
- [ ] JWT の有効期限が適切に設定されていること
- [ ] 他ユーザーの診断結果にアクセスできないこと（認可チェック）
- [ ] 無効なトークンでのアクセスが拒否されること

#### 入力バリデーション
- [ ] SQL インジェクション（Supabase クライアント経由のパラメータバインド確認）
- [ ] 不正な `result_type` 値の登録が拒否されること
- [ ] リクエストボディの過大なペイロードに対する制限

#### レート制限
- [ ] `/api/auth` エンドポイントへのブルートフォース攻撃が制限されること（express-rate-limit）
- [ ] レート制限超過時に適切なエラー（429）が返ること

#### 環境・設定
- [ ] `.env` が `.gitignore` に含まれていること
- [ ] `SUPABASE_SERVICE_ROLE_KEY` が外部に露出していないこと
- [ ] 本番環境で `JWT_SECRET` がデフォルト値から変更されていること

### 発見事項

| 重要度 | 項目 | 状態 |
|--------|------|------|
| 高 | ブルートフォース（レート制限なし） | ⚠️ 脆弱 |
| 中 | Stored XSS（DBに保存されるが未実行） | ⚠️ 部分的 |
| 低 | SQLインジェクション | ✅ 防御済 |
| 低 | セッションハイジャック | ✅ 防御済 |
| 低 | ディレクトリトラバーサル | ✅ 防御済 |

### 備考


