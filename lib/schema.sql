-- フリーランス管理ツール スキーマ

CREATE TABLE IF NOT EXISTS projects (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  client_name TEXT NOT NULL,
  price      INTEGER NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'planning'
               CHECK (status IN ('planning', 'in_progress', 'completed', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'todo'
               CHECK (status IN ('todo', 'doing', 'done')),
  due_date   DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ダミーデータ（デモ用）
INSERT INTO projects (name, client_name, price, status) VALUES
  ('コーポレートサイト制作', '株式会社サンプル商事', 450000, 'in_progress'),
  ('ECサイトリニューアル',   '山田商店',             800000, 'in_progress'),
  ('採用LP制作',             '株式会社テックスタート', 180000, 'planning'),
  ('管理システム改修',        '佐藤工務店',            320000, 'completed'),
  ('ブランドサイト制作',      'フラワーショップ花音',  250000, 'paused')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (project_id, name, status, due_date)
SELECT p.id, t.name, t.status, t.due_date::DATE
FROM (
  VALUES
    ('コーポレートサイト制作', 'ワイヤーフレーム確認',  'done',  CURRENT_DATE - INTERVAL '5 days'),
    ('コーポレートサイト制作', 'デザインカンプ提出',    'doing', CURRENT_DATE + INTERVAL '2 days'),
    ('コーポレートサイト制作', 'コーディング実装',      'todo',  CURRENT_DATE + INTERVAL '7 days'),
    ('ECサイトリニューアル',   '要件定義ヒアリング',    'done',  CURRENT_DATE - INTERVAL '3 days'),
    ('ECサイトリニューアル',   'DB設計',                'doing', CURRENT_DATE + INTERVAL '1 days'),
    ('ECサイトリニューアル',   'API実装',               'todo',  CURRENT_DATE + INTERVAL '5 days'),
    ('採用LP制作',             'キックオフミーティング', 'done', CURRENT_DATE - INTERVAL '1 days'),
    ('採用LP制作',             '素材収集',              'todo',  CURRENT_DATE + INTERVAL '3 days'),
    ('管理システム改修',       '仕様確認',              'done',  CURRENT_DATE - INTERVAL '10 days'),
    ('管理システム改修',       'テスト実施',            'done',  CURRENT_DATE - INTERVAL '5 days')
) AS t(project_name, name, status, due_date)
JOIN projects p ON p.name = t.project_name
ON CONFLICT DO NOTHING;
