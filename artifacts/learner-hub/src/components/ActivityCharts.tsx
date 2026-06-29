import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar, Legend, Cell, PieChart, Pie } from "recharts";
import { Activity, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { weeklyProgress, xpGrowth, courseCompletion } from "@/data/chartData";

export default function ActivityCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="col-span-1 lg:col-span-1 rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Weekly Progress</h2>
        </div>
        <div className="flex-1 h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="col-span-1 lg:col-span-1 rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-bold text-foreground">XP Growth</h2>
        </div>
        <div className="flex-1 h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={xpGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
              <Line type="monotone" dataKey="xp" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="col-span-1 lg:col-span-1 rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-2">
          <PieChartIcon className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-foreground">Course Completion</h2>
        </div>
        <div className="flex-1 h-[250px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={courseCompletion}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {courseCompletion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-foreground">45%</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed</span>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {courseCompletion.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
              {item.name}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
