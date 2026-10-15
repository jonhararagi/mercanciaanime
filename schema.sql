PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  series TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK(price >= 0),
  image TEXT,
  source TEXT,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS garment_prices (
  garment TEXT PRIMARY KEY,
  price INTEGER NOT NULL CHECK(price >= 0)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  delivery TEXT NOT NULL DEFAULT 'Coordinar por mensaje',
  items_json TEXT NOT NULL,
  total INTEGER NOT NULL CHECK(total >= 0),
  status TEXT NOT NULL DEFAULT 'Nuevo'
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

INSERT OR IGNORE INTO products (id, name, series, label, price, image, source, enabled, sort_order) VALUES
(1,'Nube de Akatsuki','Naruto','Logo · pecho',12000,'https://commons.wikimedia.org/wiki/Special:FilePath/Akatsuki_nuage.svg','https://commons.wikimedia.org/wiki/File:Akatsuki_nuage.svg',1,1),
(2,'Logo Kimetsu no Yaiba','Demon Slayer','Logo · clásico',12000,'https://commons.wikimedia.org/wiki/Special:FilePath/Kimetsu_no_Yaiba_logo.svg','https://commons.wikimedia.org/wiki/File:Kimetsu_no_Yaiba_logo.svg',1,2),
(3,'Logo Dragon Ball','Dragon Ball','Logo · clásico',12000,'https://commons.wikimedia.org/wiki/Special:FilePath/Dragonball_Anime-Serie_Original-Logo.svg','https://commons.wikimedia.org/wiki/File:Dragonball_Anime-Serie_Original-Logo.svg',1,3),
(4,'Esfera del dragón','Dragon Ball','Símbolo · pecho',11000,'https://commons.wikimedia.org/wiki/Special:FilePath/Dragon_ball.svg','https://commons.wikimedia.org/wiki/File:Dragon_ball.svg',1,4),
(5,'Logo Jujutsu Kaisen','Jujutsu Kaisen','Logo · clásico',12500,'https://commons.wikimedia.org/wiki/Special:FilePath/Jujutsu_Kaisen_logo.svg','https://commons.wikimedia.org/wiki/File:Jujutsu_Kaisen_logo.svg',1,5),
(6,'Logo Bleach TYBW','Bleach','Logo · clásico',12500,'https://commons.wikimedia.org/wiki/Special:FilePath/Bleach_Thousand-Year_Blood_War_Logo.svg','https://commons.wikimedia.org/wiki/File:Bleach_Thousand-Year_Blood_War_Logo.svg',1,6),
(7,'Logo Naruto','Naruto','Logo · clásico',12000,'https://commons.wikimedia.org/wiki/Special:FilePath/Naruto_logo.svg','https://commons.wikimedia.org/wiki/File:Naruto_logo.svg',1,7),
(8,'Energía maldita','Jujutsu Kaisen','Símbolo · minimal',12000,NULL,NULL,1,8),
(9,'Respiración de fuego','Demon Slayer','Símbolo · minimal',12000,NULL,NULL,1,9),
(10,'Estética anime nocturna','Originales','Diseño original',11000,NULL,NULL,1,10);

INSERT OR IGNORE INTO garment_prices (garment, price) VALUES
('Remera clásica',12000),
('Remera oversize',16000),
('Buzo',26000),
('Sticker',2500),
('Taza',7000);

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  attempted_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_ip_time ON admin_login_attempts(ip_hash, attempted_at);

CREATE TABLE IF NOT EXISTS order_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  attempted_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_attempts_ip_time ON order_attempts(ip_hash, attempted_at);
