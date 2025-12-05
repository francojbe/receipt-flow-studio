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
    const { email, userId, back_url } = await req.json()
    const accessToken = Deno.env.get('MP_ACCESS_TOKEN')

    if (!accessToken) {
      throw new Error('Missing MP_ACCESS_TOKEN')
    }

    const planId = "17b4eb90818b45ec94ee09024f445208"
    const checkoutUrl = `https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=${planId}&external_reference=${userId}&payer_email=${email}`

    console.log('Generating checkout URL:', checkoutUrl)

    return new Response(
      JSON.stringify({
        success: true,
        init_point: checkoutUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
