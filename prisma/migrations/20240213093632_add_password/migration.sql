-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Snippet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Snippet" ("code", "id", "title") SELECT "code", "id", "title" FROM "Snippet";
DROP TABLE "Snippet";
ALTER TABLE "new_Snippet" RENAME TO "Snippet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
