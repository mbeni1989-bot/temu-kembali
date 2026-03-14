import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Trash2,
  Shield,
  BarChart3,
  Globe,
  Settings,
  Activity,
  UserCog,
  Gavel,
  Clock,
  TrendingUp,
  AlertOctagon
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function SuperAdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Check if user is super admin
  if (!isAuthenticated || user?.role !== "super_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the super admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setLocation("/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-red-500/10 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl md:text-4xl font-bold">Super Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Full platform control and management</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 online now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
              <Gavel className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">5 urgent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all registered users</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Search users..." className="w-64" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">John Doe</h4>
                          <p className="text-sm text-muted-foreground">john@example.com • ID: USR{i}234</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                        <Badge>User</Badge>
                        <Badge variant="secondary">5 Reports</Badge>
                        <Select>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Actions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View Profile</SelectItem>
                            <SelectItem value="promote">Promote to Moderator</SelectItem>
                            <SelectItem value="suspend">Suspend</SelectItem>
                            <SelectItem value="ban">Ban User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Admin & Moderator Management</CardTitle>
                    <CardDescription>Manage staff members and their permissions</CardDescription>
                  </div>
                  <Button>
                    <UserCog className="w-4 h-4 mr-2" />
                    Add Admin
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Alice Admin", role: "super_admin", status: "online", activity: "2 min ago" },
                    { name: "Bob Moderator", role: "admin", status: "online", activity: "15 min ago" },
                    { name: "Charlie Mod", role: "moderator", status: "offline", activity: "2 hours ago" },
                  ].map((admin, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${admin.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                        <div>
                          <h4 className="font-semibold">{admin.name}</h4>
                          <p className="text-sm text-muted-foreground">Last active: {admin.activity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={admin.role === "super_admin" ? "default" : "secondary"}>
                          {admin.role.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        {admin.role !== "super_admin" && (
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Activity Monitor */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Activity</CardTitle>
                <CardDescription>Monitor actions performed by staff members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { admin: "Bob Moderator", action: "Approved report #1234", time: "5 min ago" },
                    { admin: "Alice Admin", action: "Banned user USR5678", time: "15 min ago" },
                    { admin: "Charlie Mod", action: "Resolved dispute #89", time: "1 hour ago" },
                    { admin: "Bob Moderator", action: "Reviewed flagged content", time: "2 hours ago" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border-l-2 border-primary/50 bg-accent/30 rounded">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{log.admin}</p>
                          <p className="text-xs text-muted-foreground">{log.action}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dispute Resolution Center</CardTitle>
                <CardDescription>Handle conflicts between users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "DSP001", type: "fraud", priority: "high", parties: "User A vs User B", created: "2 hours ago" },
                    { id: "DSP002", type: "fake_item", priority: "medium", parties: "User C vs User D", created: "1 day ago" },
                    { id: "DSP003", type: "payment_issue", priority: "low", parties: "User E vs User F", created: "3 days ago" },
                  ].map((dispute, i) => (
                    <div key={i} className={`p-4 border rounded-lg ${dispute.priority === 'high' ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Gavel className="w-5 h-5 text-yellow-500" />
                          <div>
                            <h4 className="font-semibold">Dispute #{dispute.id}</h4>
                            <p className="text-sm text-muted-foreground">{dispute.parties}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={dispute.priority === "high" ? "destructive" : "secondary"}>
                            {dispute.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{dispute.type.replace("_", " ")}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Created: {dispute.created}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Review Case
                        </Button>
                        <Button size="sm" variant="outline">
                          Assign to Admin
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Audit Logs</CardTitle>
                    <CardDescription>Track all system activities</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="user">User Actions</SelectItem>
                        <SelectItem value="admin">Admin Actions</SelectItem>
                        <SelectItem value="system">System Events</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { action: "user.ban", user: "admin@example.com", target: "user123", ip: "192.168.1.1", time: "2 min ago" },
                    { action: "report.delete", user: "mod@example.com", target: "RPT456", ip: "192.168.1.2", time: "15 min ago" },
                    { action: "admin.promote", user: "superadmin@example.com", target: "user789", ip: "192.168.1.3", time: "1 hour ago" },
                    { action: "dispute.resolve", user: "admin@example.com", target: "DSP001", ip: "192.168.1.1", time: "2 hours ago" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded text-sm hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            by {log.user} • target: {log.target} • IP: {log.ip}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed rounded">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Chart placeholder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed rounded">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Chart placeholder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded">
                    <p className="text-2xl font-bold">67%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <p className="text-2xl font-bold">2.3h</p>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-sm text-muted-foreground">User Retention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Manage platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Geo-blocking */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Geo-blocking
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Blocked Countries</p>
                        <p className="text-sm text-muted-foreground">Restrict access from specific countries</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">0 countries</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Rate Limiting</span>
                      <Badge variant="secondary">100 req/15min</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Data Encryption</span>
                      <Badge variant="secondary">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Report Limits</span>
                      <Badge variant="secondary">3/day, 7/month</Badge>
                    </div>
                  </div>
                </div>

                {/* Maintenance */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Maintenance
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <AlertOctagon className="w-4 h-4 mr-2" />
                      Enable Maintenance Mode
                    </Button>
                    <Button variant="outline">Clear Cache</Button>
                    <Button variant="outline">Backup Database</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

