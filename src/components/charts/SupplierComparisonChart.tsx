import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supplierComparison } from '@/lib/mock-data';

export function SupplierComparisonChart() {
  return (
    <div className="chart-container">
      <h3 className="mb-4 text-lg font-semibold">Supplier Comparison</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={supplierComparison} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
            <XAxis dataKey="name" stroke="hsl(215, 15%, 45%)" fontSize={12} />
            <YAxis yAxisId="left" stroke="hsl(215, 15%, 45%)" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(215, 15%, 45%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 20%, 90%)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="emissions"
              name="Emissions (tonnes)"
              fill="hsl(168, 76%, 32%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="score"
              name="Sustainability Score"
              fill="hsl(160, 84%, 39%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
