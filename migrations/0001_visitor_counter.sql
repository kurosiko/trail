CREATE TABLE IF NOT EXISTS visitor_counter (
  singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0)
);

INSERT OR IGNORE INTO visitor_counter (singleton, total) VALUES (1, 0);

CREATE TABLE IF NOT EXISTS visitors (
  canonical_id TEXT PRIMARY KEY,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);

CREATE TRIGGER IF NOT EXISTS visitors_increment_counter
AFTER INSERT ON visitors
BEGIN
  UPDATE visitor_counter SET total = total + 1 WHERE singleton = 1;
END;

CREATE TABLE IF NOT EXISTS visitor_ids (
  visitor_id TEXT PRIMARY KEY,
  canonical_id TEXT NOT NULL,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS visitor_ids_canonical_id
ON visitor_ids (canonical_id);

CREATE TABLE IF NOT EXISTS visitor_networks (
  network_key TEXT PRIMARY KEY,
  canonical_id TEXT NOT NULL,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS visitor_networks_canonical_id
ON visitor_networks (canonical_id);

CREATE TRIGGER IF NOT EXISTS visitor_networks_create_visitor
AFTER INSERT ON visitor_networks
BEGIN
  INSERT OR IGNORE INTO visitors (canonical_id, first_seen, last_seen)
  VALUES (NEW.canonical_id, NEW.first_seen, NEW.last_seen);
END;

CREATE TABLE IF NOT EXISTS visitor_rate_limits (
  rate_key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  requests INTEGER NOT NULL CHECK (requests >= 0)
);
