'use client';

import { MenuItemType } from '@/types';
import {
  faChartLine,
  faCog,
  faEllipsisV,
  faList,
  faPlusCircle,
  faQuestionCircle,
  faRss,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/DropdownMenu';
import UserProfileSkeleton from './UserProfileSkeleton';

const menuItems: MenuItemType[] = [
  { to: '/dashboard', icon: faChartLine, label: 'Dashboard' },
  { to: '/generator', icon: faPlusCircle, label: 'Gerador RSS', badge: 'dot' },
  { to: '/feeds', icon: faList, label: 'Meus Feeds', chip: '12' },
  { divider: true },
  { to: '/settings', icon: faCog, label: 'Configurações' },
  { to: '/help', icon: faQuestionCircle, label: 'Ajuda' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-72 sidebar-glassmorphism z-40 mobile-menu ${
        open ? 'open' : ''
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-[rgb(var(--primary))] to-cyan-400 rounded-xl flex items-center justify-center pulse-glow">
            <FontAwesomeIcon icon={faRss} className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[rgb(var(--text-primary))] to-[rgb(var(--text-secondary))] bg-clip-text text-transparent">
              NewsPulse
            </h1>
            <p className="text-xs text-[rgb(var(--text-muted))]">
              Dashboard v1.0
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, idx) =>
            item.divider ? (
              <hr
                key={`hr-${idx}`}
                className="border-[rgb(var(--border))]/20 my-4"
              />
            ) : (
              <Link key={item.to} href={item.to!} passHref>
                <div
                  className={`menu-item px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer ${
                    pathname === item.to ? 'active' : ''
                  }`}
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={item.icon!} className="w-5" />
                  <span>{item.label}</span>
                  {item.badge === 'dot' && (
                    <span className="notification-dot ml-auto w-2 h-2 bg-red-500 rounded-full" />
                  )}
                  {item.chip && (
                    <span
                      className={`ml-auto text-xs ${
                        item.chipColor
                          ? item.chipColor
                          : 'bg-[rgb(var(--primary))]'
                      } px-2 py-1 rounded-full text-white`}
                    >
                      {item.chip}
                    </span>
                  )}
                </div>
              </Link>
            ),
          )}
        </nav>

        <div className="mt-auto">
          {status === 'loading' ? (
            <UserProfileSkeleton />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="glassmorphism rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[rgb(var(--text-primary))]">
                      {session?.user?.username ?? 'Usuário'}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-[rgb(var(--text-muted))]"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" side="top" align="end">
                <DropdownMenuItem
                  className="cursor-pointer hover:brightness-50 transition-all"
                  onClick={() => signOut({ callbackUrl: '/signin' })}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </aside>
  );
}