import React from 'react';
import type { ServerProps } from 'payload';
import { EntityType, groupNavItems } from '@payloadcms/ui/shared';
import { AdminNavClient, type NavGroupItem } from './AdminNavClient';

export const AdminNav: React.FC<ServerProps & { visibleEntities?: { collections: string[]; globals: string[] } }> = async (
  props
) => {
  const { i18n, payload, permissions, user, visibleEntities } = props;

  if (!payload?.config) {
    return null;
  }

  const { collections, globals } = payload.config;
  const visibleCollections = visibleEntities?.collections || collections.map((c) => c.slug);
  const visibleGlobals = visibleEntities?.globals || globals.map((g) => g.slug);

  const grouped = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleCollections.includes(slug))
        .map((collection) => ({
          type: EntityType.collection as EntityType.collection,
          entity: collection,
        })),
      ...globals
        .filter(({ slug }) => visibleGlobals.includes(slug))
        .map((global) => ({
          type: EntityType.global as EntityType.global,
          entity: global,
        })),
    ],
    permissions as any,
    i18n
  );

  const serializedGroups: NavGroupItem[] = grouped.map((g) => ({
    label: String(g.label),
    entities: g.entities.map((e) => ({
      slug: e.slug,
      type: e.type,
      label: e.label,
    })),
  }));

  return <AdminNavClient groups={serializedGroups} user={user} />;
};

export default AdminNav;
