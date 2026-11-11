CREATE TABLE "AffiliateSlot" (
    "slot" INTEGER NOT NULL,
    "userId" TEXT,
    CONSTRAINT "AffiliateSlot_pkey" PRIMARY KEY ("slot")
);

CREATE UNIQUE INDEX "AffiliateSlot_userId_key" ON "AffiliateSlot"("userId");

ALTER TABLE "AffiliateSlot"
ADD CONSTRAINT "AffiliateSlot_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

DO $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM "AffiliateProfile" AS profile
        JOIN "User" AS account ON account."id" = profile."userId"
        WHERE account."role" = 'AFFILIATE'
    ) > 5 THEN
        RAISE EXCEPTION 'Cannot enable the five-affiliate pilot while more than five affiliates exist.';
    END IF;
END $$;

INSERT INTO "AffiliateSlot" ("slot")
VALUES (1), (2), (3), (4), (5);

WITH "rankedAffiliates" AS (
    SELECT
        profile."userId",
        ROW_NUMBER() OVER (ORDER BY profile."createdAt", profile."id") AS "slot"
    FROM "AffiliateProfile" AS profile
    JOIN "User" AS account ON account."id" = profile."userId"
    WHERE account."role" = 'AFFILIATE'
)
UPDATE "AffiliateSlot" AS slot
SET "userId" = affiliate."userId"
FROM "rankedAffiliates" AS affiliate
WHERE slot."slot" = affiliate."slot";
