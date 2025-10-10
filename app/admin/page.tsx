"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import RoleBadge from "@/components/RoleBadge";
import {
  UserPlus,
  Settings,
  Shield,
  Users,
  Crown,
  Trash2,
  Sparkles,
} from "lucide-react";

interface TeamMember {
  id: string;
  address: string;
  role: "Admin" | "Member" | "Donor" | "Viewer";
  joinedDate: string;
}

export default function AdminPage(): React.JSX.Element {
  const [newMemberAddress, setNewMemberAddress] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
      role: "Admin",
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      role: "Member",
      joinedDate: "2024-02-20",
    },
    {
      id: "3",
      address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
      role: "Donor",
      joinedDate: "2024-03-10",
    },
  ]);

  const roles = ["Admin", "Member", "Donor", "Viewer"];

  const handleAddMember = (): void => {
    if (newMemberAddress && newMemberRole) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        address: newMemberAddress,
        role: newMemberRole as "Admin" | "Member" | "Donor" | "Viewer",
        joinedDate: new Date().toISOString().split("T")[0],
      };
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberAddress("");
      setNewMemberRole("");
    }
  };

  const handleRemoveMember = (id: string): void => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded-full border border-green-500/50 mb-4">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              Admin Panel
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
            Team Management
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage campaign members, assign roles, and control access
            permissions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Member Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-950/50 border-green-900/30 mb-8">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-xl text-green-50">
                    Add Team Member
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-green-50"
                  >
                    Wallet Address
                  </Label>
                  <Input
                    id="address"
                    value={newMemberAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                      setNewMemberAddress(e.target.value)
                    }
                    placeholder="0x..."
                    className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-green-50"
                  >
                    Role
                  </Label>
                  <Select
                    value={newMemberRole}
                    onValueChange={setNewMemberRole}
                  >
                    <SelectTrigger className="bg-gray-900/50 border-green-900/30 text-green-50 focus:border-green-500">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-950 border-green-900/30">
                      {roles.map((role: string) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="text-green-50 focus:bg-green-900/20 focus:text-green-400"
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAddMember}
                  disabled={!newMemberAddress || !newMemberRole}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </CardContent>
            </Card>

            {/* Team Members List */}
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <CardTitle className="text-xl text-green-50">
                      Team Members
                    </CardTitle>
                  </div>
                  <Badge className="bg-green-900/30 text-green-400 border-green-500/50">
                    {teamMembers.length} members
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member: TeamMember) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-green-900/20 hover:border-green-500/30 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-green-400">
                            {formatAddress(member.address)}
                          </span>
                          <RoleBadge role={member.role} />
                        </div>
                        <p className="text-xs text-gray-500">
                          Joined{" "}
                          {new Date(member.joinedDate).toLocaleDateString()}
                        </p>
                      </div>

                      <Button
                        onClick={(): void => handleRemoveMember(member.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Role Permissions */}
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-lg text-green-50">
                    Role Permissions
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-50 text-sm mb-1">
                        Admin
                      </p>
                      <p className="text-xs text-gray-400">
                        Full control: manage members, approve expenses, create
                        campaigns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-50 text-sm mb-1">
                        Member
                      </p>
                      <p className="text-xs text-gray-400">
                        Can log expenses and view campaign details
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-50 text-sm mb-1">
                        Donor
                      </p>
                      <p className="text-xs text-gray-400">
                        View-only access with donation history
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-50 text-sm mb-1">
                        Viewer
                      </p>
                      <p className="text-xs text-gray-400">
                        Read-only access to public data
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-green-950/20 border-green-900/30">
              <CardContent className="p-6">
                <Shield className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="font-semibold text-green-50 mb-2">
                  On-Chain Access Control
                </h3>
                <p className="text-sm text-gray-400">
                  All role assignments are recorded on-chain for transparency
                  and security
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
