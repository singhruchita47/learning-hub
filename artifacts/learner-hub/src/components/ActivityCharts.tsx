import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Activity, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { weeklyProgress, xpGrowth, courseCompletion } from "@/data/chartData";

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white px-4 py-3 shadow-xl border border-primary/10">
        <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-extrabold text-primary">{payload[0].value}h</p>
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white px-4 py-3 shadow-xl border border-emerald-100">
        <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-extrabold text-emerald-600">{payload[0].value.toLocaleString()} XP</p>
      </div>
    );
  }
  return null;
};

export default function ActivityCharts() {
  const totalHours = weeklyProgress.reduce((s, d) => s + d.hours, 0).toFixed(1);
  const maxXP = Math.max(...xpGrowth.map(d => d.xp));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weekly Progress - Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-white p-6 shadow-xl border border-primary/5 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">Weekly Progress</h2>
              <p className="text-xs text-muted-foreground">Study hours this week</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-primary">{totalHours}h</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyProgress} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="30%">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#CBD5E1' }} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(79,70,229,0.05)', radius: 8 }} />
              <Bar dataKey="hours" fill="url(#barGrad)" radius={[8, 8, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Day indicators */}
        <div className="flex justify-between px-1">
          {weeklyProgress.map((d) => (
            <div key={d.name} className="flex flex-col items-center gap-1">
              <div
                className="rounded-full"
                style={{
                  width: 6, height: 6,
                  background: d.hours >= 5 ? '#4F46E5' : d.hours >= 3 ? '#818CF8' : '#E0E7FF'
                }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* XP Growth - Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-6 shadow-xl border border-emerald-50 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">XP Growth</h2>
              <p className="text-xs text-muted-foreground">Experience points earned</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-emerald-600">{maxXP.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Peak XP</div>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={xpGrowth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#CBD5E1' }} />
              <Tooltip content={<CustomLineTooltip />} />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#10B981"
                strokeWidth={3.5}
                fill="url(#xpGrad)"
                dot={{ r: 6, fill: '#fff', stroke: '#10B981', strokeWidth: 2.5 }}
                activeDot={{ r: 8, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Growth badge */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-700">+325% growth this month</span>
        </div>
      </motion.div>

      {/* Course Completion - Donut */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white p-6 shadow-xl border border-amber-50 flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
            <PieChartIcon className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-foreground">Course Completion</h2>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </div>
        </div>

        <div className="relative flex-1 h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={courseCompletion}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {courseCompletion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 700 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-extrabold text-foreground">45%</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Completed</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {courseCompletion.map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-1 rounded-xl p-2" style={{ background: item.fill + '15' }}>
              <div className="text-lg font-extrabold" style={{ color: item.fill }}>{item.value}%</div>
              <div className="text-[10px] font-semibold text-muted-foreground text-center leading-tight">{item.name}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
