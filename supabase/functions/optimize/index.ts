import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { operationalData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are a carbon footprint optimization expert. Analyze this company's operational data and provide exactly 8-12 optimization recommendations.

Operational Data:
- Energy Consumption: ${operationalData.energy_consumption || 'N/A'} ${operationalData.energy_unit || 'kWh'}
- Carbon Emissions: ${operationalData.carbon_emissions || 'N/A'} tCO2e
- Waste Generated: ${operationalData.waste_generated || 'N/A'} tonnes
- Water Usage: ${operationalData.water_usage || 'N/A'} kL
- Workforce: ${operationalData.workforce_count || 'N/A'} employees
- Annual Revenue: $${operationalData.annual_revenue || 'N/A'}
- Production Capacity: ${operationalData.production_capacity || 'N/A'}
- Supply Chain: ${operationalData.supply_chain_info || 'N/A'}
- Challenges: ${operationalData.current_challenges || 'N/A'}

Calculated Metrics:
- Emission Intensity: ${operationalData.carbon_emissions && operationalData.annual_revenue ? (operationalData.carbon_emissions / (operationalData.annual_revenue / 1000000)).toFixed(2) : 'N/A'} tCO2e per $1M revenue
- Energy per Employee: ${operationalData.energy_consumption && operationalData.workforce_count ? (operationalData.energy_consumption / operationalData.workforce_count).toFixed(1) : 'N/A'} ${operationalData.energy_unit || 'kWh'}/employee
- Waste per Employee: ${operationalData.waste_generated && operationalData.workforce_count ? (operationalData.waste_generated / operationalData.workforce_count).toFixed(2) : 'N/A'} tonnes/employee

For each recommendation provide: category, title, description (2-3 sentences with specific numbers), potential_savings (quantified), impact_level (high/medium/low).

Categories to cover: Energy Efficiency, Carbon Reduction, Waste Reduction, Water Conservation, Supply Chain, Workforce Optimization, Cost Reduction, Renewable Energy.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a carbon footprint optimization AI. Always respond with actionable, data-driven recommendations." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_optimizations",
            description: "Provide optimization recommendations based on operational data analysis",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      potential_savings: { type: "string" },
                      impact_level: { type: "string", enum: ["high", "medium", "low"] },
                    },
                    required: ["category", "title", "description", "potential_savings", "impact_level"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["recommendations"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_optimizations" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error: " + response.status);
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    let recommendations = [];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      recommendations = parsed.recommendations || [];
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("optimize error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
