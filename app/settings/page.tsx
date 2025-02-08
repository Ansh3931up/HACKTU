'use client'
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F]">
      <Header  
        title="Settings" 
        subtitle="Get your customization"
      />
      <div className="container mx-auto p-4">
      <Card className=" max-w-7xl mx-auto bg-white dark:bg-[#111011] shadow-xl ">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-old-money-burgundy text-3xl font-semibold">User Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium p-2">
                Username
              </label>
              <Input type="text" id="username" placeholder="Enter your username" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium p-2">
                Email
              </label>
              <Input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium p-2">
                Password
              </label>
              <Input type="password" id="password" placeholder="Enter your password" />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
} 
