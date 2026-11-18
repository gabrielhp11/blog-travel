import { prisma } from "@/lib/prisma";

export async function audit(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId: string,
  details?: Record<string, string | number | boolean | null>,
): Promise<void> {
  await prisma.auditLog.create({
    data: { actorId, action, entityType, entityId, details },
  });
}
