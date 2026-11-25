'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@payloadcms/translations';
import {
  Hamburger,
  Link,
  NavGroup,
  useConfig,
  useNav,
  useTranslation,
} from '@payloadcms/ui';
import { EntityType } from '@payloadcms/ui/shared';
import { formatAdminURL } from 'payload/shared';
import { AdminSidebarUser } from './AdminSidebarUser';

export interface NavEntityItem {
  slug: string;
  type: EntityType;
  label: any;
}

export interface NavGroupItem {
  label: string;
  entities: NavEntityItem[];
}

export interface AdminNavClientProps {
  groups: NavGroupItem[];
  user?: any;
}

const baseClass = 'nav';

export const AdminNavClient: React.FC<AdminNavClientProps> = ({ groups, user }) => {
  const pathname = usePathname() || '';
  const { config } = useConfig();
  const { i18n } = useTranslation();
  const { hydrated, navOpen, navRef, setNavOpen, shouldAnimate } = useNav();

  const adminRoute = config?.routes?.admin || '/admin';

  const wrapperClass = [
    baseClass,
    navOpen && `${baseClass}--nav-open`,
    shouldAnimate && `${baseClass}--nav-animate`,
    hydrated && `${baseClass}--nav-hydrated`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={wrapperClass}>
      <div className={`${baseClass}__scroll`} ref={navRef}>
        <nav className={`${baseClass}__wrap`}>
          {groups.map((group, groupIdx) => (
            <NavGroup
              key={`${group.label}-${groupIdx}`}
              isOpen={false}
              label={group.label}
            >
              {group.entities.map((entity, idx) => {
                let href = adminRoute;
                let id = `nav-${entity.slug}`;

                if (entity.type === EntityType.collection) {
                  href = formatAdminURL({
                    adminRoute,
                    path: `/collections/${entity.slug}`,
                  });
                  id = `nav-${entity.slug}`;
                } else if (entity.type === EntityType.global) {
                  href = formatAdminURL({
                    adminRoute,
                    path: `/globals/${entity.slug}`,
                  });
                  id = `nav-global-${entity.slug}`;
                }

                const isActive =
                  pathname.startsWith(href) &&
                  ['/', undefined].includes(pathname[href.length]);

                const labelText = getTranslation(entity.label, i18n);

                const content = (
                  <>
                    {isActive ? <div className={`${baseClass}__link-indicator`} /> : null}
                    <span className={`${baseClass}__link-label`}>{labelText}</span>
                  </>
                );

                if (pathname === href) {
                  return (
                    <div key={`${id}-${idx}`} className={`${baseClass}__link`} id={id}>
                      {content}
                    </div>
                  );
                }

                return (
                  <Link
                    key={`${id}-${idx}`}
                    className={`${baseClass}__link`}
                    href={href}
                    id={id}
                    prefetch={false}
                  >
                    {content}
                  </Link>
                );
              })}
            </NavGroup>
          ))}

          {/* Tarjeta minimalista de usuario en la parte inferior del sidebar */}
          <AdminSidebarUser user={user} />
        </nav>

        <div className={`${baseClass}__header`}>
          <div className={`${baseClass}__header-content`}>
            <button
              type="button"
              aria-label={navOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
              className={`${baseClass}__mobile-close`}
              onClick={() => setNavOpen(!navOpen)}
            >
              <Hamburger isActive={navOpen} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminNavClient;
