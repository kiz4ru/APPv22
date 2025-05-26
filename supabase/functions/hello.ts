// @ts-nocheck
/// <reference lib="deno.ns" />
import { corsHeaders } from './_shared/cors.ts';

// ...resto del código...

Deno.serve(async (req) => {
  // ✅ IMPORTANTE: responder a la petición preflight del navegador
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name } = await req.json();

    const data = {
      message: `Hello ${name}`,
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});