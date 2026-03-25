"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMusicalNotes, IoAlbums, IoConstruct, IoHome, IoPricetags } from "react-icons/io5";

const navItems = [
  { href: "/", label: "Dashboard", icon: IoHome },
  { href: "/songs", label: "Completed", icon: IoAlbums },
  { href: "/wips", label: "Works in Progress", icon: IoConstruct },
  { href: "/tags", label: "Tags", icon: IoPricetags },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-fuchsia-500 flex items-center justify-center">
            <IoMusicalNotes className="text-white text-xl" />
          </div>
          <div>
            <h1 className="font-semibold text-text text-sm tracking-wide">ARDEN VALE</h1>
            <p className="text-text-faint text-xs">Music Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent-glow text-accent border border-pink-500/20"
                  : "text-text-muted hover:text-text hover:bg-surface-hover"
              }`}
            >
              <Icon className={`text-lg ${isActive ? "text-accent" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-text-faint text-xs text-center">
          Private Dashboard
        </p>
      </div>
    </aside>
  );
}
