"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Menu, X } from "lucide-react";
import { JSX, useState } from "react";
import {
  ConnectWallet,
  Wallet as WalletComponent,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";

export default function Navigation(): JSX.Element {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navLinks: Array<{ href: string; label: string }> = [
    { href: "/explore", label: "Explore" },
    { href: "/create", label: "Create Campaign" },
    { href: "/admin", label: "Admin" },
  ];

  const isActive = (href: string): boolean => pathname === href;

  return (
    <nav className="bg-black border-b border-green-900/30 sticky top-0 z-50 backdrop-blur-lg bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              ChainLedger
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link: { href: string; label: string }) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-green-900/30 text-green-400 border border-green-500/30"
                    : "text-gray-400 hover:text-green-400 hover:bg-green-900/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletComponent>
              <ConnectWallet className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold border-0">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity
                  className="px-4 py-2"
                  hasCopyAddressOnClick
                >
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect className="hover:bg-red-900/20 text-red-400" />
              </WalletDropdown>
            </WalletComponent>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-green-400"
            onClick={(): void => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-green-900/30">
            {navLinks.map((link: { href: string; label: string }) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-green-900/30 text-green-400 border border-green-500/30"
                    : "text-gray-400 hover:text-green-400 hover:bg-green-900/10"
                }`}
                onClick={(): void => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <WalletComponent>
                <ConnectWallet className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold border-0">
                  <Avatar className="h-6 w-6" />
                  <Name />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity
                    className="px-4 py-2"
                    hasCopyAddressOnClick
                  >
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect className="hover:bg-red-900/20 text-red-400" />
                </WalletDropdown>
              </WalletComponent>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
