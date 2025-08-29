"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/app/lib/supabase"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

export default function TestDatabase() {
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const testConnection = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const supabase = createClient()
      
      // Test basic connection
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .limit(5)
      
      if (error) {
        throw error
      }
      
      setPolls(data || [])
      setSuccess(`Successfully connected! Found ${data?.length || 0} polls.`)
      
    } catch (err: any) {
      setError(err.message || "Failed to connect to database")
      console.error("Database test error:", err)
    } finally {
      setLoading(false)
    }
  }

  const testCreatePoll = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const supabase = createClient()
      
      // Test creating a poll (this will fail due to RLS if not authenticated)
      const { data, error } = await supabase
        .from('polls')
        .insert({
          title: "Test Poll",
          description: "This is a test poll",
          created_by: "00000000-0000-0000-0000-000000000000", // Dummy UUID
          is_public: true,
          allow_multiple_votes: false
        })
        .select()
      
      if (error) {
        // This is expected due to RLS policies
        setSuccess("Database connection works! RLS policies are active (expected error: " + error.message + ")")
      } else {
        setSuccess("Test poll created successfully!")
        // Clean up the test poll
        await supabase.from('polls').delete().eq('id', data[0].id)
      }
      
    } catch (err: any) {
      setError(err.message || "Failed to test poll creation")
      console.error("Poll creation test error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          Database Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button 
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Testing..." : "Test Connection"}
          </Button>
          
          <Button 
            onClick={testCreatePoll}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Testing..." : "Test Poll Creation"}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {polls.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Recent Polls:</h3>
            <div className="space-y-2">
              {polls.map((poll) => (
                <div key={poll.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{poll.title}</p>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(poll.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 mt-4">
          <p><strong>Note:</strong> This component tests basic database connectivity.</p>
          <p>• "Test Connection" checks if you can read from the database</p>
          <p>• "Test Poll Creation" verifies RLS policies are working</p>
        </div>
      </CardContent>
    </Card>
  )
}
