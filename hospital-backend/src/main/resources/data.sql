-- seed essential roles (id numbers optional but helpful)
INSERT INTO roles (id, name) VALUES (1, 'ROLE_PATIENT') ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_DOCTOR') ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name) VALUES (3, 'ROLE_ADMIN') ON CONFLICT (id) DO NOTHING;
