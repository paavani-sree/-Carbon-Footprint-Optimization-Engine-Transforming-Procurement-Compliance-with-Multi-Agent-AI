import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { emissionsTrend } from '@/lib/mock-data';

export function EmissionsTrendChart() {
  return (
    <div className="chart-container">
      <h3 className="mb-4 text-lg font-semibold">Emissions Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={emissionsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 76%, 32%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(168, 76%, 32%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
            <XAxis dataKey="month" stroke="hsl(215, 15%, 45%)" fontSize={12} />
            <YAxis stroke="hsl(215, 15%, 45%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 20%, 90%)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="emissions"
              name="Actual Emissions"
              stroke="hsl(168, 76%, 32%)"
              fillOpacity={1}
              fill="url(#colorEmissions)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="hsl(38, 92%, 50%)"
              fillOpacity={1}
              fill="url(#colorTarget)"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
