#### Tabel: rooms

| Field         | Type         | Key         |
| ------------- | ------------ | ----------- |
| id            | int          | Primary Key |
| uuid          | varchar(36)  | Unique      |
| creator_uuid  | int          | Foreign Key |
| name          | varchar(255) |             |
| description   | text         |             |
| password      | varchar(255) |             |
| video_enabled | boolean      |             |
| sound_enabled | boolean      |             |
| created_at    | timestamp    |             |
| updated_at    | timestamp    |             |

#### Tabel: participants

| Field      | Type         | Key         |
| ---------- | ------------ | ----------- |
| id         | int          | Primary Key |
| uuid       | varchar(36)  | Unique      |
| room_id    | int          | Foreign Key |
| name       | varchar(255) |             |
| created_at | timestamp    |             |
| updated_at | timestamp    |             |

#### Tabel: chats

| Field      | Type      | Key         |
| ---------- | --------- | ----------- |
| id         | int       | Primary Key |
| room_id    | int       | Foreign Key |
| user_id    | int       | Foreign Key |
| message    | text      |             |
| created_at | timestamp |             |
| updated_at | timestamp |             |

#### Tabel: breakout_rooms

| Field       | Type         | Key         |
| ----------- | ------------ | ----------- |
| id          | int          | Primary Key |
| room_id     | int          | Foreign Key |
| creator_id  | int          | Foreign Key |
| name        | varchar(255) |             |
| description | text         |             |
| created_at  | timestamp    |             |
| updated_at  | timestamp    |             |

#### Tabel: breakout_participants

| Field            | Type      | Key         |
| ---------------- | --------- | ----------- |
| id               | int       | Primary Key |
| breakout_room_id | int       | Foreign Key |
| participant_id   | int       | Foreign Key |
| created_at       | timestamp |             |
| updated_at       | timestamp |             |

#### Tabel: breakout_chats

| Field            | Type      | Key         |
| ---------------- | --------- | ----------- |
| id               | int       | Primary Key |
| breakout_room_id | int       | Foreign Key |
| user_id          | int       | Foreign Key |
| message          | text      |             |
| created_at       | timestamp |             |
| updated_at       | timestamp |             |

Dengan tabel-tabel ini, Anda memiliki struktur yang memadai untuk mendukung fitur "breakout room" dalam aplikasi video call meet Anda. Setiap tabel memiliki keterkaitan yang sesuai untuk mengelola informasi tentang ruang utama, peserta, obrolan, serta ruang breakout dan partisipannya.
