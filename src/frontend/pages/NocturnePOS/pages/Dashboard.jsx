import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Simple icon components using inline SVG
const DollarSign = () => (
  <svg className="h-5 w-5 text-noc-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShoppingCart = () => (
  <svg className="h-5 w-5 text-noc-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const Users = () => (
  <svg className="h-5 w-5 text-noc-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TrendingUp = () => (
  <svg className="h-5 w-5 text-noc-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function Dashboard() {
  const stats = [
    { title: "Today's Sales", value: "$2,543.00", Icon: DollarSign, trend: "+12.5%" },
    { title: "Orders", value: "48", Icon: ShoppingCart, trend: "+8.2%" },
    { title: "Active Tables", value: "12", Icon: Users, trend: "+3" },
    { title: "Avg. Order", value: "$52.98", Icon: TrendingUp, trend: "+5.3%" },
  ];

  return (
    <div className="p-8 space-y-8 bg-noc min-h-screen">
      <div>
        <h1 className="text-4xl font-bold mb-2 neon-text">Dashboard</h1>
        <p className="text-gray-400">Welcome back to Nocturne POS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-hover border-noc">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.Icon />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-noc-primary mt-1">{stat.trend} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-noc">
          <CardHeader>
            <CardTitle className="text-white">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium text-white">Order #{1000 + i}</p>
                    <p className="text-sm text-gray-400">Table {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${(45 + i * 10).toFixed(2)}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                      Preparing
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-noc">
          <CardHeader>
            <CardTitle className="text-white">Top Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Signature Cocktail', 'House Wine', 'Premium Beer', 'Appetizer Platter', 'Dessert Special'].map((item, i) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                  <span className="font-medium text-white">{item}</span>
                  <span className="text-sm text-gray-400">{24 - i * 3} sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
