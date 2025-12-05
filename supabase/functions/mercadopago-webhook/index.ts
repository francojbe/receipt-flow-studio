import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const topic = url.searchParams.get('topic') || url.searchParams.get('type')
    const id = url.searchParams.get('id') || url.searchParams.get('data.id')

    // Parse body to handle different notification formats
    const body = await req.json().catch(() => ({}))
    const eventType = body.type || topic
    const eventId = body.data?.id || id

    console.log(`Received Webhook: ${eventType} ID: ${eventId}`)

    if (!eventId) {
      return new Response('No ID found', { status: 200 })
    }

    // Initialize Supabase Admin Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const accessToken = Deno.env.get('MP_ACCESS_TOKEN')

    // Handle Subscription Created/Updated
    if (eventType === 'subscription_preapproval') {
      const res = await fetch(`https://api.mercadopago.com/preapproval/${eventId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      const subscription = await res.json()

      console.log('Subscription details:', subscription)

      if (subscription.status === 'authorized') {
        const userId = subscription.external_reference

        if (userId) {
          console.log(`Activating subscription for user: ${userId}`)

          const { error } = await supabase.from('profiles').update({
            subscription_status: 'active',
            plan_type: 'pro',
            updated_at: new Date().toISOString()
          }).eq('id', userId)

          if (error) {
            console.error('Error updating profile:', error)
            throw error
          }
        }
      } else if (subscription.status === 'cancelled' || subscription.status === 'paused') {
        const userId = subscription.external_reference

        if (userId) {
          console.log(`Deactivating subscription for user: ${userId} (Status: ${subscription.status})`)

          const { error } = await supabase.from('profiles').update({
            subscription_status: 'inactive', // Or 'cancelled' if you prefer specific status
            updated_at: new Date().toISOString()
          }).eq('id', userId)

          if (error) {
            console.error('Error deactivating profile:', error)
            throw error
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
